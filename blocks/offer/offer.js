/* eslint-disable no-underscore-dangle */
export default async function decorate(block) {
  const aempublishurl = 'https://publish-p130407-e1279066.adobeaemcloud.com';
  const aemauthorurl = 'https://author-p130407-e1279066.adobeaemcloud.com';
  const persistedquery = '/graphql/execute.json/atruvia/angebotSparenByPath';
  const offerpath = block.querySelector(':scope div:nth-child(1) > div a').innerHTML.trim();
  const variationname = block.querySelector(':scope div:nth-child(2) > div').innerHTML.trim();

  const url = window.location && window.location.origin && window.location.origin.includes('author')
    ? `${aemauthorurl}${persistedquery};path=${offerpath};variation=${variationname};ts=${Math.random() * 1000}`
    : `${aempublishurl}${persistedquery};path=${offerpath};variation=${variationname};ts=${Math.random() * 1000}`;
  const options = { credentials: 'include' };

  const cfReq = await fetch(url, options)
    .then((response) => response.json())
    .then((contentfragment) => {
      let offer = '';
      if (contentfragment.data) {
        /* offer = contentfragment.data.offerByPath.item; */
        offer = contentfragment.data.angebotSparenByPath.item;
        
      }
      return offer;
    });

  const itemId = `urn:aemconnection:${offerpath}/jcr:content/data/master`;

  block.innerHTML = `
  <div class='banner-content' data-aue-resource=${itemId} data-aue-label="offer content fragment" data-aue-type="reference" data-aue-filter="cf">
      <div data-aue-prop="heroImage" data-aue-label="hero image" data-aue-type="media" class='banner-detail' style="background-image: linear-gradient(90deg,rgba(0,0,0,0.6), rgba(0,0,0,0.1) 80%) ,url(${aempublishurl + cfReq.bild._dynamicUrl});">
          <p data-aue-prop="headline" data-aue-label="headline" data-aue-type="text" class='pretitle'>${cfReq.ueberschrift}</p>
          <p data-aue-prop="pretitle" data-aue-label="pretitle" data-aue-type="text" class='headline'>${cfReq.untertitel.plaintext}</p>
          <p data-aue-prop="detail" data-aue-label="detail" data-aue-type="richtext" class='detail'>${cfReq.beschreibungAngebot.plaintext}</p>
      </div>
      <div class='banner-logo'>
      </div>
  </div>
`;
}
