import { test, expect } from "bun:test";

import parseSearchResult from ".";
import searchResult from "./searchResult.json";

test("can extract images info", () => {
  const result = parseSearchResult(JSON.stringify(searchResult));

  expect(result).toEqual([
    {
      alt: "Ramarao Bobby Blogs Importance Of Giving ASP.NET Online Test BlogAdda",
      width: 800,
      height: 440,
      url: "https://blogadda.s3.amazonaws.com/images/posts/Importance-of-Giving-ASP-NET-1539087614-large.jpg",
    },
    {
      alt: "How Can You Use Testing as a Service (TaaS) in Your Business?",
      width: 1536,
      height: 1027,
      url: "https://techgenix.com/tgwordpress/wp-content/uploads/2022/08/3-2-1536x1027.png",
    },
    {
      alt: "Stogie-Geeks-Small-Test-2 Image.jpeg - Stogie Geeks",
      width: 1920,
      height: 1080,
      url: "https://i0.wp.com/stogiegeeks.com/wp-content/uploads/2017/01/Stogie-Geeks-Small-Test-2__Image.jpeg?w=1920&ssl=1",
    },
    {
      alt: "Why Don't Companies A/B Test Their Websites?",
      width: 1600,
      height: 1200,
      url: "https://conversion-uplift.co.uk/wp-content/uploads/2015/02/test-letters-1236704-1600x1200-1.jpg",
    },
    {
      alt: "Lazy Cat Wine Club Test - NFT PlayToEarn",
      width: 2480,
      height: 2480,
      url: "https://openseauserdata.com/files/3051b9ce49b872d9d6f6e1deee24e0f7.png",
    },
    {
      alt: "Test Computer Key In Blue Showing Quiz Or Online Questionnaire - Miller Producti",
      width: 3000,
      height: 3000,
      url: "https://www.millerproductivity.com/wp-content/uploads/2016/01/5829-101413-gs5829.jpg",
    },
    {
      alt: "Майстерня Steam::test sborka1",
      width: 1280,
      height: 720,
      url: "https://steamuserimages-a.akamaihd.net/ugc/2048611558772867300/15B601275259F084AF3CC2A583485271AC60DF3F/?imw=512&amp;imh=288&amp;ima=fit&amp;impolicy=Letterbox&amp;imcolor=%23000000&amp;letterbox=true",
    },
    {
      alt: "B1+ Use of English Test 3 - English online tests",
      width: 1100,
      height: 621,
      url: "https://englishonlinetests.com/wp-content/uploads/2021/02/scale_1200.jpg",
    },
    {
      alt: "Testing - NYSEA",
      width: 1920,
      height: 880,
      url: "https://nysea.com/wp-content/uploads/2017/01/test-big.png",
    },
    {
      alt: "My Top Choices of Printer Test Images for Photographers",
      width: 3600,
      height: 2700,
      url: "https://www.lapseoftheshutter.com/wp-content/uploads/2021/08/color-printer-test-page.jpg",
    },
    {
      alt: "Best practices to write better integration tests by Catalin Dinuta Medium",
      width: 1200,
      height: 798,
      url: "https://miro.medium.com/v2/resize:fit:1200/1*MY8AlnW0-R_Mml_x_hmWBA.png",
    },
    {
      alt: "Scantron TEST blocks and pencil. - Piqosity - Adaptive Learning & Student Manage",
      width: 2560,
      height: 1931,
      url: "https://www.piqosity.com/wp-content/uploads/2021/10/Best-Online-ISEE-Test-Prep-scaled.jpg",
    },
    {
      alt: "Free aptitude tests, practice aptitude tests (job customised to Australia) inclu",
      width: 3293,
      height: 2455,
      url: "https://www.psychometricinstitute.com.au/uploads/job_classification_image.jpg",
    },
    {
      alt: "1000 test! Robe is not for sale 1568 comfort comfort healthy sleep Robes - AliEx",
      width: 1280,
      height: 906,
      url: "https://ae01.alicdn.com/kf/H9d6ef7f981d14a19aee19663c281d11d8/1000-test-Robe-is-not-for-sale-1568-comfort-comfort-healthy-sleep.jpg",
    },
    {
      alt: "Nov 19th Test - Steemit",
      width: 1024,
      height: 1024,
      url: "https://d1e4pidl3fu268.cloudfront.net/66963e4a-ccba-4fdd-ba18-d5862fb4dba7/test.png",
    },
    {
      alt: "Test ate - 78 фото",
      width: 1173,
      height: 596,
      url: "https://nakonu.com/wp-content/uploads/2020/03/123203.jpg",
    },
    {
      alt: "Значок тест - 78 фото",
      width: 1196,
      height: 1200,
      url: "https://avatars.dzeninfra.ru/get-zen_doc/3993525/pub_5f85a78b01c3532acc3e0944_5f85a7a53940476c666415ca/scale_1200",
    },
    {
      alt: "Test png image",
      width: 1500,
      height: 1127,
      url: "https://img-0.journaldunet.com/j1PLKIztY77FxcJEqxKDQqbd-Qo=/1500x/smart/0d824f295a9742e1a9e66ec0f7ced20d/ccmcms-jdn/10209727.jpg",
    },
    {
      alt: "Google Updates Testing Tools With Better JavaScript Support",
      width: 1600,
      height: 840,
      url: "https://www.searchenginejournal.com/wp-content/uploads/2019/08/4fb0b228-7421-45de-873e-198dfb323c31.jpeg",
    },
    {
      alt: "TEST - South Stage Keynote on Livestream",
      width: 2462,
      height: 1382,
      url: "https://img.new.livestream.com/events/00000000008970d1/4ce72e58-d07d-4f73-a914-ea8bba418e66.png",
    },
    {
      alt: "Demystifying Pester Mocking: A Comprehensive Tutorial",
      width: 2000,
      height: 800,
      url: "https://adamtheautomator.com/wp-content/uploads/2019/12/what-is-pester-for-powershell-test-670091_1280.png",
    },
    {
      alt: "Testing Product on 1111",
      width: 1200,
      height: 1200,
      url: "https://static-01.daraz.pk/p/0fa00f693b1c8d5a2b25ec7de274f52b.jpg",
    },
    {
      alt: "Teaching to the Test",
      width: 2847,
      height: 1616,
      url: "https://mikefrosolono.com/wp-content/uploads/2015/04/TeachingMFBlogPost-e1429801823918.jpeg",
    },
    {
      alt: "Test product - cghardware",
      width: 960,
      height: 960,
      url: "https://cghardware.com/wp-content/uploads/2023/07/ppoj2qnh1vvp0bwexc15xoot-large.png",
    },
    {
      alt: "Avoiding the Waste of Test Churn: Three Tips to Prep Before You Test - Lean Star",
      width: 1920,
      height: 1455,
      url: "https://leanstartup.co/wp-content/uploads/2017/10/board-361516_1920.jpg",
    },
    {
      alt: "The Test Killer",
      width: 1200,
      height: 801,
      url: "https://townsquare.media/site/504/files/2012/12/Test-Anxiety-Treatment-Boca-Raton.jpg?w=1200&h=0&zc=1&s=0&a=t&q=89",
    },
    {
      alt: "Text for testing",
      width: 1170,
      height: 1170,
      url: "https://static.wikia.nocookie.net/britneyspears/images/a/a9/Example.jpg/revision/latest?cb=20220201181038",
    },
    {
      alt: "Angular Tests Made Easy With Spectator by Netanel Basal Netanel Basal",
      width: 1200,
      height: 857,
      url: "https://miro.medium.com/v2/resize:fit:1200/1*NnEiq0BSh3I3mcPO66BoPA.jpeg",
    },
    {
      alt: "Testing Internationalization -localization by Matt Medium",
      width: 764,
      height: 582,
      url: "https://miro.medium.com/v2/resize:fit:764/1*FTxc7Vo62LATPrLbgNnFJw.png",
    },
    {
      alt: "Brother Color Laser Printer Test Page",
      width: 3508,
      height: 2480,
      url: "https://i.pinimg.com/originals/50/b5/62/50b5628086e2bd02032f9235a30ea64f.jpg",
    },
    {
      alt: "Test for errors - SAFETY4SEA",
      width: 2048,
      height: 2048,
      url: "https://safety4sea.com/wp-content/uploads/2020/04/test.png",
    },
    {
      alt: "Security Guard exam test questions set 1 - Close Career",
      width: 1600,
      height: 1067,
      url: "https://www.closecareer.com/wp-content/uploads/test-questions.jpg",
    },
    {
      alt: "Tested ru тесты - 78 фото",
      width: 931,
      height: 759,
      url: "https://sun9-41.userapi.com/impg/9kSsvL1PJDgjoFDs93-Kod50guI4cLouJDtHqA/LBC7Ksgz7wM.jpg?size=931x759&quality=95&sign=b947e891f6af0f3b9e4a922cf3d53a8f&c_uniq_tag=rjPLvaMftonXghUIQgKCwYgbCvnKLT5H_WCIkkr-ptE&type=album",
    },
    {
      alt: "Road signs of right of way test free image download",
      width: 2800,
      height: 1980,
      url: "https://pixy.org/src2/598/5987113.jpg",
    },
    {
      alt: "Синдром профессионального выгорания - Развивайся",
      width: 900,
      height: 722,
      url: "https://irinachekurina.ru/wp-content/uploads/2019/11/faf6c452ab79817305bdf3060fa801bf_xl.jpg",
    },
    {
      alt: "Road sign of road testing free image download",
      width: 2000,
      height: 1757,
      url: "https://pixy.org/src/6/64324.png",
    },
    {
      alt: "Test apk - 85 фото",
      width: 900,
      height: 900,
      url: "https://yt3.googleusercontent.com/ytc/APkrFKbSF60JTHVORCadENHs2pqfOAX8a9v_UixANN3P=s900-c-k-c0x00ffffff-no-rj",
    },
    {
      alt: "5 Psychology Test-Taking Strategies and Tips",
      width: 3866,
      height: 2578,
      url: "https://www.verywellmind.com/thmb/ZfYYDAxONWXXK6ywwrPQXN_ctJ8=/3866x0/filters:no_upscale():max_bytes(150000):strip_icc()/79253051-56a794665f9b58b7d0ebdf1a.jpg",
    },
    {
      alt: "Radionomy Enjoy the best Pop-Rock / Rock online radio stations",
      width: 512,
      height: 512,
      url: "https://ws.shoutcast.com/images/contacts/b/b44c/b44cf43b-dc6f-4b58-9b4f-fb8b2eb490f5/radios/36e1b97a-6872-4a03-88df-6e503e071cfe/36e1b97a-6872-4a03-88df-6e503e071cfe.png",
    },
  ]);
});
