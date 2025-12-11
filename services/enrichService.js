import axios from 'axios';
import pLimit from 'p-limit';
import Lead from '../models/Lead.js';

const NATIONALIZE_URL = 'https://api.nationalize.io';
const CONCURRENCY = parseInt(process.env.ENRICH_CONCURRENCY || '5');

async function enrichName(name) {
  const url = `${NATIONALIZE_URL}?name=${encodeURIComponent(name)}`;

  try {
    const { data } = await axios.get(url, { timeout: 8000 });

    if (!data || !data.country || data.country.length === 0) {
      return { name, country: null, probability: 0 };
    }

    const top = data.country.reduce((a, b) =>
      a.probability > b.probability ? a : b
    );

    return { name, country: top.country_id, probability: top.probability };

  } catch (err) {
    console.error('Enrich error', name, err.message);
    return { name, country: null, probability: 0 };
  }
}

export async function enrichBatch(namesArray) {
  const limit = pLimit(CONCURRENCY);

  const tasks = namesArray.map(n => limit(() => enrichName(n)));
  const results = await Promise.all(tasks);

  const saved = await Promise.all(
    results.map(async res => {
      const status = res.probability > 0.6 ? 'Verified' : 'To Check';

      const doc = new Lead({
        name: res.name,
        country: res.country,
        probability: res.probability,
        status
      });

      return doc.save();
    })
  );

  return saved;
}
