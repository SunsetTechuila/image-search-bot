import { test, expect } from "bun:test";

import extractImageLinks from ".";
import searchResult from "./searchResult.json";

test("extractImageLinks", () => {
  const result = extractImageLinks(searchResult);

  expect(result).toEqual([
    "https://i.ytimg.com/vi/-puikxnk-Gg/maxresdefault.jpg",
    "https://yt3.ggpht.com/ytc/AMLnZu-kD5NxjzKgymWKiI3gafv3t29ys-C8xRCn2E0U=s900-c-k-c0x00ffffff-no-rj",
    "https://sun9-52.userapi.com/impf/g09L6YETvdsdf9F2Axkpn6Obfc355yfjX0UMLQ/sOHvVaph1EY.jpg?size=604x305&quality=95&sign=5292f62d9bbc2fc8f3946f1fd529cc03&type=album",
    "https://sun9-25.userapi.com/impf/c637931/v637931529/16893/X1P-COUNeaY.jpg?size=960x480&quality=96&sign=8c2590f1ea456b1608f38237af65b89f&c_uniq_tag=5daHDx_dFitwxt9vNkGANdqmdW4fqnUqPLMHn50W01A&type=album",
    "https://risovach.ru/upload/2015/02/mem/paskuda-tvar_73469204_orig_.jpg",
    "https://risovach.ru/upload/2014/03/mem/tolstaya-amerikanka_45321499_orig_.jpg",
    "http://kotomatrix.ru/images/lolz/2015/12/15/kotomatritsa_jM.jpg",
    "https://risovach.ru/upload/2018/03/mem/zlaya-ovca_171805628_orig_.jpg",
    "https://i.ytimg.com/vi/N2M1pUgnt1c/maxresdefault.jpg",
    "https://tatcenter.ru/wp-content/uploads/2022/03/ty-posmotrel-syuda-scaled.jpg",
    "https://sun9-79.userapi.com/impg/QzqTs8mDyThZ_CwLgD5u5bUXjLPwE7Mk6NAY6Q/D7YzaOz-7Bk.jpg?size=358x166&quality=95&sign=c8a18131fb42d2f0ce34945ddf104d15&type=album",
    "https://sun9-80.userapi.com/impf/c631619/v631619117/450e2/loTPdfw9M4I.jpg?size=600x270&quality=96&sign=7f42e46c308dd37460679ecfbba67228&c_uniq_tag=q-ynLpQRDespvgefIpgX7-SUqbLWYOedQeqS5v-Nuw0&type=album",
    "https://theslide.ru/img/thumbs/9fcd0d219e936c23b45220254a8e6e12-800x.jpg",
    "https://sun9-56.userapi.com/impg/CgRm6x_er9rYNSoegmM4AjdNQI4gPXQKlQFpyg/GsTTdDHCbBM.jpg?size=598x576&quality=96&sign=581edd2c1dd2fde3f75fc8c3e2fa0a3f&c_uniq_tag=vFOKYkDgO3NQo7Yq-tGMldgFWTRoM06WCSQlq57oz9A&type=album",
    "http://upload.rpg-club.net/upload_image/Imperia_121007_9/small/3.png",
    "https://userpic.fishki.net/2021/01/01/433270/decbd950ed393bea08c25f23df2ec77b.jpg",
    "https://demotions.ru/uploads/posts/2018-05/1525512242_Smotri-syuda._demotions.ru.jpg",
    "https://turboseo.net.ua/files/Image/blog/nestandartnaja_navigacija/funfzehnte_600.jpg",
    "https://static.tildacdn.com/tild3463-3464-4964-a532-623532626132/Frame_9.png",
    "https://sun9-6.userapi.com/OjNhlbbJtmq_SYlsUNZOYRICnYojrUgJ9S1x3Q/Kr8kHs5TFjY.jpg",
    "http://kotomatrix.ru/images/lolz/2009/08/06/335529.jpg",
    "https://img2.reactor.cc/pics/post/full/%D0%BF%D0%BE%D1%82%D0%BE%D0%BC-%D1%81%D1%8E%D0%B4%D0%B0-%D1%87%D0%B5%D1%80%D0%BD%D1%8B%D0%B5-%D0%B1%D1%83%D0%BA%D0%B2%D1%8B-%D0%BD%D0%B0-%D0%B1%D0%B5%D0%BB%D0%BE%D0%BC-%D1%84%D0%BE%D0%BD%D0%B5-3548569.png",
    "https://porno-kniga.ru/800/600/http/risovach.ru/upload/2013/01/mem/nelzya-prosto-tak-vzyat-i-boromir-mem_10046425_orig_.jpg",
    "https://risovach.ru/upload/2016/10/mem/gubka-bob-dikar_127298866_orig_.jpg",
    "https://risovach.ru/upload/2017/07/mem/troll-advice_150959164_orig_.jpg",
    "https://sun9-44.userapi.com/impg/XTjSfnpxe37kmzlI28xhSkB7f2bPj-HD0EftOA/cidBenjRPoI.jpg?size=324x344&quality=96&sign=30852b2c9159281b400bead94a26d949&type=album",
    "https://sun9-65.userapi.com/impf/c626124/v626124055/28c68/boO9TwEGjHI.jpg?size=480x360&quality=96&sign=7167399cc60ee8ff7eca56c9d6ec9f08&type=album",
    "https://risovach.ru/upload/2014/01/mem/merilin-menson_41514331_orig_.jpeg",
    "https://pp.userapi.com/eEcyVZ1SCP1zKiFHvKtIcBJr5xgQnPXMyFB2iA/apESdIG6GCI.jpg",
    "https://cdn.gigi.click/data/upload/UID1807021_1681735918_54.jpg",
  ]);
});
