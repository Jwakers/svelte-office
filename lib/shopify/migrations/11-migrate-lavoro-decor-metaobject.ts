require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

// Set up the Shopify GraphQL endpoint
const SHOPIFY_GRAPHQL_URL = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-04/graphql.json`;
const TAXONOMY_COLOR_MAP = {
  Beige: 'gid://shopify/TaxonomyValue/6',
  Black: 'gid://shopify/TaxonomyValue/1',
  Blue: 'gid://shopify/TaxonomyValue/2',
  Bronze: 'gid://shopify/TaxonomyValue/657',
  Brown: 'gid://shopify/TaxonomyValue/7',
  Clear: 'gid://shopify/TaxonomyValue/17',
  Gold: 'gid://shopify/TaxonomyValue/4',
  Gray: 'gid://shopify/TaxonomyValue/8',
  Green: 'gid://shopify/TaxonomyValue/9',
  Multicolor: 'gid://shopify/TaxonomyValue/2865',
  Navy: 'gid://shopify/TaxonomyValue/15',
  Orange: 'gid://shopify/TaxonomyValue/10',
  Pink: 'gid://shopify/TaxonomyValue/11',
  Purple: 'gid://shopify/TaxonomyValue/12',
  Red: 'gid://shopify/TaxonomyValue/13',
  'Rose gold': 'gid://shopify/TaxonomyValue/16',
  Silver: 'gid://shopify/TaxonomyValue/5',
  White: 'gid://shopify/TaxonomyValue/3',
  Yellow: 'gid://shopify/TaxonomyValue/14'
};

const TAXONOMY_PATTERN_MAP = {
  Abstract: 'gid://shopify/TaxonomyValue/24477',
  Animal: 'gid://shopify/TaxonomyValue/24478',
  Art: 'gid://shopify/TaxonomyValue/24479',
  'Bead & reel': 'gid://shopify/TaxonomyValue/24480',
  Birds: 'gid://shopify/TaxonomyValue/2283',
  Brick: 'gid://shopify/TaxonomyValue/24481',
  "Bull's eye": 'gid://shopify/TaxonomyValue/24482',
  Camouflage: 'gid://shopify/TaxonomyValue/2866',
  Characters: 'gid://shopify/TaxonomyValue/2867',
  Checkered: 'gid://shopify/TaxonomyValue/2868',
  Chevron: 'gid://shopify/TaxonomyValue/24483',
  Chinoiserie: 'gid://shopify/TaxonomyValue/24484',
  Christmas: 'gid://shopify/TaxonomyValue/2869',
  Collage: 'gid://shopify/TaxonomyValue/24485',
  Coral: 'gid://shopify/TaxonomyValue/24486',
  Damask: 'gid://shopify/TaxonomyValue/24487',
  Diagonal: 'gid://shopify/TaxonomyValue/24488',
  Diamond: 'gid://shopify/TaxonomyValue/24489',
  "Dog's tooth": 'gid://shopify/TaxonomyValue/24490',
  Dots: 'gid://shopify/TaxonomyValue/2870',
  'Egg & dart': 'gid://shopify/TaxonomyValue/24491',
  Ethnic: 'gid://shopify/TaxonomyValue/24492',
  'Everlasting knot': 'gid://shopify/TaxonomyValue/24493',
  Floral: 'gid://shopify/TaxonomyValue/2871',
  Fret: 'gid://shopify/TaxonomyValue/24494',
  Geometric: 'gid://shopify/TaxonomyValue/1868',
  Guilloche: 'gid://shopify/TaxonomyValue/24495',
  Hearts: 'gid://shopify/TaxonomyValue/2375',
  Illusion: 'gid://shopify/TaxonomyValue/24496',
  Leaves: 'gid://shopify/TaxonomyValue/2872',
  Logo: 'gid://shopify/TaxonomyValue/24497',
  Mosaic: 'gid://shopify/TaxonomyValue/24498',
  Ogee: 'gid://shopify/TaxonomyValue/24499',
  Organic: 'gid://shopify/TaxonomyValue/24500',
  Paisley: 'gid://shopify/TaxonomyValue/2873',
  Plaid: 'gid://shopify/TaxonomyValue/24501',
  Rainbow: 'gid://shopify/TaxonomyValue/24502',
  Random: 'gid://shopify/TaxonomyValue/24503',
  Scale: 'gid://shopify/TaxonomyValue/24504',
  Scroll: 'gid://shopify/TaxonomyValue/24505',
  Solid: 'gid://shopify/TaxonomyValue/2874',
  Stars: 'gid://shopify/TaxonomyValue/2376',
  Striped: 'gid://shopify/TaxonomyValue/2875',
  Swirl: 'gid://shopify/TaxonomyValue/24506',
  Text: 'gid://shopify/TaxonomyValue/1782',
  Texture: 'gid://shopify/TaxonomyValue/24507',
  'Tie-dye': 'gid://shopify/TaxonomyValue/2876',
  Trellis: 'gid://shopify/TaxonomyValue/24508',
  Vehicle: 'gid://shopify/TaxonomyValue/1796',
  Other: 'gid://shopify/TaxonomyValue/24509'
};

// Function to execute a GraphQL query
async function graphqlQuery(query: string, variables = {}) {
  try {
    const response = await axios.post(
      SHOPIFY_GRAPHQL_URL,
      { query, variables },
      {
        headers: {
          'X-Shopify-Access-Token': process.env.SHOPIFY_METAOBJECT_MANAGEMENT_ACCESS_TOKEN,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('GraphQL query error:', error.response.data.errors);
  }
}

// Fetch all Lavoro Decor metaobject entries
async function fetchLavoroDecorEntries() {
  const query = `
      {
        metaobjects(first:100, type: "lavoro_frame") {
          edges {
            node {
              id
              handle
              fields {
                key
                value
              }
            }
          }
        }
      }
    `;

  const response = await graphqlQuery(query);
  return response.data.metaobjects.edges.map((edge: any) => edge.node);
}

// Create a new Color metaobject entry
async function updateColorMetaobjectEntry(
  handle: string,
  fields: { key: string; value: string }[]
) {
  const mutation = `
      mutation UpsertMetaobject($handle: MetaobjectHandleInput!, $metaobject: MetaobjectUpsertInput!) {
        metaobjectUpsert(handle: $handle, metaobject: $metaobject) {
          metaobject {
            id
            handle
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

  const variables = {
    handle: {
      type: 'shopify--color-pattern',
      handle
    },
    metaobject: {
      fields
    }
  };

  const response = await graphqlQuery(mutation, variables);
  console.log(JSON.stringify(response, null, 2));
  if (response.data.metaobjectUpsert.userErrors.length > 0) {
    console.error('Error updating Color metaobject:', response.data.metaobjectCreate.userErrors);
  } else {
    console.log(`Created Color metaobject with handle: ${handle}`);
  }
}

// Main migration function
async function migrateLavoroDecorToColor() {
  const lavoroDecorEntries = await fetchLavoroDecorEntries();

  if (!lavoroDecorEntries || lavoroDecorEntries.length === 0) {
    console.log('No Lavoro Decor entries found.');
  }

  for (const entry of lavoroDecorEntries) {
    const { handle, fields } = entry;
    console.log(fields);
    const remappedFields = fields.map(({ key, value }: { key: string; value: string }) => {
      let k = key,
        v = value;
      if (key === 'colour') k = 'color';
      if (key === 'base_colour') {
        k = 'color_taxonomy_reference';
        const colors = JSON.parse(value);
        v = `["${TAXONOMY_COLOR_MAP[colors[0] as keyof typeof TAXONOMY_COLOR_MAP]}"]`;

        if (value.includes('Grey')) {
          v = `["${TAXONOMY_COLOR_MAP['Gray']}"]`;
        }
      }

      if (key === 'base_pattern') {
        k = 'pattern_taxonomy_reference';
        v = TAXONOMY_PATTERN_MAP[value as keyof typeof TAXONOMY_PATTERN_MAP];

        if (value.includes('Textured')) v = TAXONOMY_PATTERN_MAP['Texture'];
        if (value.includes('Wood')) v = TAXONOMY_PATTERN_MAP['Texture'];
      }

      return { key: k, value: v };
    });

    console.log(remappedFields);

    // Create a new Color metaobject entry based on the Lavoro Decor entry
    await updateColorMetaobjectEntry(`lavoro-${handle}`, remappedFields);
  }

  console.log('Migration completed successfully!');
}

// Run the migration
migrateLavoroDecorToColor();
