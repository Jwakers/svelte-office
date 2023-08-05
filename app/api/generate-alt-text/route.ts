import { getProductimages, updateProductImageAlt } from 'lib/shopify';
import { NextResponse } from 'next/server';

const generateAltText = async function (imageUrl: string) {
  let startResponse = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Token ' + process.env.REPLICATE_API_KEY
    },
    body: JSON.stringify({
      version: '2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746',
      input: { image: imageUrl }
    })
  });

  let jsonStartResponse = await startResponse.json();
  let endpointUrl = jsonStartResponse.urls.get;

  // GET request to get the status of the alt generation process & return the result when it's ready
  let altText: string | null = null;
  while (!altText) {
    // Loop in 500ms intervals until the alt text is ready
    let finalResponse = await fetch(endpointUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + process.env.REPLICATE_API_KEY
      }
    });
    let jsonFinalResponse = await finalResponse.json();
    if (jsonFinalResponse.status === 'succeeded') {
      altText = jsonFinalResponse.output.split('Caption: ')[1];
    } else if (jsonFinalResponse.status === 'failed') {
      break;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  return altText;
};

const iterateImages = async function () {
  const images = await getProductimages();
  for (const image of images) {
    if (!image.altText) {
      const altText = await generateAltText(image.url);
      if (altText) {
        try {
          const res = await updateProductImageAlt(image.productId, image.id, altText);
          console.log(`Image update for ${image.productTitle} - ${altText}`);
        } catch (e) {
          console.log(e);
        }
      } else {
        console.log(`Could not generate alt text for: ${image.id} (${image.productTitle})`);
      }
    }
  }
  console.log('Alt text updates complete');
};

export async function GET(request: Request) {
  try {
    await iterateImages();
    return NextResponse.json('Images alt text updated', { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
