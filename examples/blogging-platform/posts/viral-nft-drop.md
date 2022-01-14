---
title: On Launching A Viral NFT Drop
description: We launched our Founding Member NFT that sold out in 90 mins. Here's a post on how we did it and what we learned from it.
date: '2022-01-02'
image: nft-recap.png
blurhash: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAlZJREFUWEe9l4vK6zAMg0936fs/764/CnxB0Zy2jHEGIV3TVrLsOPayruv7385vWZa9R6br7/f255eKQAX4DYkEr8gMBADxuboncytCAPhcXet97ncCCar/p9OpAVVjprk+XI3X6/VxvxmCCwABVLOPIyQSGFDNPvy5gQCA5/O5gTNz31VJNyCpWwro8/nsBPxa73QCDi5gHzM10g36YFoNoGYfkGsEkFegl8ulDQjoOtXgeVTwQEu5HfTxeDQSzF0BpAXc50oJjwdUcL+KRFosUB8o0xVw66/Xa1fC1SAmIOwugIAr4NYK/H6/dxK61rMDAQEzBAyRLRVSAQ88CGC5QCGhWeudAIBOwpWAhO8IT0auQPo9Cdxut67EQGBd12Y1c0XA3ZAEKvkTXJaLAEp0Algu8CSgtXSD7wRSqxPwiEd6B0eFgYCDJ4kjBOQG3/cz61FAhEoC7opqS/oZ4UFYKeBBJ2AGqjQC+qCAUMCVIDjZpp4VPRFVQVgFH9YzbyrgW9Lzwc8VUEAR/bOd8F9iIEnMMmKein4SZhomA+Jzd4HWNvPALBvuEYCE5/5qK34QyCz4y0yYuwFyPz0LqAXIBZ6M0hWsfX0aVpmQgqSKg3SH/g+nIbkgEw/bz4uSrXogzwMOpt16QB8l2ficp2BWyrOCBBU8IJ2Mrg/VhLNybOYCrwv9XEi3DDUhKTWr4ixGZ9ZXRYnHQ1UdE7AffQF7vCrFvRSbdUZVb5CVctkXoMKsE8rA22vNZh2S3x86I2Q80gtW4O4G7/2yX/S1ksDXffiXL/4BT1iftirzvU0AAAAASUVORK5CYII=
featured: false
---

On December 30th, 2021, we launched our [Founding Member NFT](/blog/dao-central-nft) – a drop of 1,124 ERC-1155 tokens that would give its holders early access to new features on DAO Central, among other perks.

Our NFT drop was a massive success. Within 90 minutes, [all our tokens were sold out](https://twitter.com/DAOCentral/status/1476579092048728066).

Let's break down how everything happened.

## Setting The Stage

On Christmas Eve, we posted this on Twitter:

https://twitter.com/DAOCentral/status/1474469391232237569?s=20

We wanted to experiment with token-gated content, while also giving back to some of our early adopters and people who have been supportive of the [DAO Central mission](/blog/introducing-dao-central) since day one.

As we started getting requests for a public mint, we decided to set up a whitelist application form to gather some responses. We recevied over 300 responses that weekend.

> FYI: "Whitelisting" is a way for DAOs & NFT projects to reward their early supporters by allowing them to mint the NFT within a certain timeframe before everyone else.

Then, on Monday, we started sending out the form to folks who responded to our ["Drop Your ENS" tweet](https://twitter.com/steventey/status/1473329920470355976) from a week ago. All 300+ of them.

That's when all hell broke loose.

## Snowball Effect

Somewhere along the way, the form got shared around by a couple of big influencers in the web3 space, and the responses [started piling up](https://twitter.com/DAOCentral/status/1475657977671544836).

First, it was 10 responses per minute, then it was 10 _per second_.

At the end of the day, we had a list of 10,000 people who had applied to be on the whitelist.

## Filtering the List

While we were grateful for the amount of attention & support that the list had gotten, we wanted to make sure our earliest users had priority when it came to minting the NFT.

We set up a VIP whitelist form and sent it out to our first 1,000 users on DAO Central.

We also brought [Seth](https://twitter.com/SethMcKilla) onto our team to help parse through the 10K responses and remove duplicate and invalid submissions. This turned out to be a clutch decision, as there were people who submitted [472 duplicate entries](https://twitter.com/SethMcKilla/status/1476688679448027145?s=20), and ones who [submitted their _physical address_ instead of their ETH address](https://twitter.com/rohail_altaf/status/1476637308644384781?s=20).

We ended up with a list of 8K folks, which was still a lot.

## Building the Mint Page

While I've been the one building out the product since day one, I knew I needed help if I were to ship the mint page in time – especially with the massive demand that we're getting.

With the help of [Twitter](https://twitter.com/steventey/status/1475706853329825797?s=20), I was able to bring on a couple of incredible devs to help out with the launch – [Rohail](https://twitter.com/rohail_altaf), [Rahat](https://twitter.com/Rahatcodes), [Matias](https://twitter.com/matiasfha), and [Maleen](https://twitter.com/itsmaleen).

Inspired by the [Buildspace DAO course](https://buildspace.so/daos), we built out our NFT mint page with [Thirdweb](https://thirdweb.com/) – an amazing Javascript SDK for developers to build smart contracts & web3 apps without needing to know solidity.

## Launch Phases

To avoid "[gas wars](https://coinmarketcap.com/alexandria/article/3-minute-tips-what-are-gas-wars)", we set up 4 different claim phases:

1. Early Adopters (~100 folks): Dec 29, 4 PM – 8 PM PST
2. VIP Whitelist (~400 folks): Dec 29, 8 PM – Dec 30 6 AM PST
3. Whitelist (~8K folks): Dec 30, 6 AM – 9 AM PST
4. Public Sale: Dec 30, 9 AM PST onwards

To make sure users are only able to mint the NFT during their respective claim phases, we used [Thirdweb's SDK](https://thirdweb.com/portal/learn/code-examples#setting-claim-conditions) to set claim conditions based on wallet addresses.

## Launch Day

As we started sending out the mint page to early adopters and folks on the VIP whitelist, images of successfully minted NFTs started popping up on Twitter (refer _Wall of Love_ below), which generated more buzz.

People started tweeting at us and sending us DMs asking where they can get their hands on the NFT.

By 6 AM, the hype was at its climax.

The moment we sent out the email to all 8,000 folks on the whitelist, the crowds started pouring in. At one point, we had around 500 users on our site, and our NFTs were getting minted in the dozens every minute.

<a href="https://plausible.io/daocentral.com" target="_blank" className="relative -my-10">
  		<BlurImage 
             src="/blog/plausible-nft.png" 
             alt="Plausible stats during our NFT launch" 
             width={1154}
             height={578}
             layout="responsive" 
             objectFit="cover" 
             placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAu9JREFUWEetV2122zAMM8+ytkubfbTpAZbe/1Dak0iQICU5+zG/vjqWbREEQUiW68e9HcdxjH/jaEdrdt3aGO/XGPdnddDe8J8xErf7jB5Ap4qb8j8A5AQIlsXhoJGt3pTr7c4ATxgYHIxMKDmjII+kK8t2AmGoFUBiRUuArBom8MAbEFMVtHxRJ7tGOe1GACAeOVOvv92fsq+BRzKFEcoowWooAYuQMmUmKvVLID5IAiWJIxlmPDMADXsJZrpzYMn5Z861BKWDuJtUhJ9VhCQyEtwiuf76+Is617akBFyMWcVy/fwaIzUArolBe4YjFgCrfjQv6cquHtCvDUA2otwVMredp/0YgAuyAkEXvA0G5qMOmm3gNT8PPvCPXsrmgtaOM/pc/g0A0S74vTsjGbJf95KOUFGiIx4D8IBI1QLbuCQVElBQbtGCkczCDEBYD0VwA0MfQ1hooDzHC5WbSRYhtDEBaD7Xg+CpFJkHplh/w1gKiKMd8roSYSgrREcBpeggwgdoplxdFJ7Qz6HWNQCn2iVu1Ot1BmDhO6jSOjlzBhCGsQfgLkdqd2YqiFAF9YBnqkA2AC4bH3CPZbWfAMienHc9AOCLEXmvXG4LI6oaMOVrZbQL9OhMUJlS+rGtCyESC1YFudzuJomysq0CbIEYmLKsh+loCZgBrD/y3TalyMhNOWUW/a7DwcLcgD7DaftBsAVAx5WZGAEYTHJAuKIFdROJPZ2vs2U1xLi8vOueMB888bz8pr6vxsXr94kJqQTaIS+/M4DxfhGWB6xlsWe5DOExe/djv5DnAmDJRDKmUH3oASWg+iPKaiPCTvj86w+VgK0UnZZLUBWy2pKB3jEDbeu9K2iHK08JwKKnrR33GqE7J5vS8IIwi45Nnn4yA7i5YAKpEgXMxrxpzRsPD1u+GZYA8vZr0yFz6yQh8DeAr4aBwnWoAFbfe0vqoQtminueUS0Y4F0Spvr2Y1UCnijLbrmDndjgD5rSjv6sPvMX8c4OROGQeTQAAAAASUVORK5CYII="
  		/>
</a>

In 90 minutes – just half the time allocated for the whitelist phase – all 1,124 NFTs had been minted.

## Wall of Love

Here are some of our favorite tweets from launch day:

<Testimonials tweets=[1476378123864506369,1476618346955083789,1476366757761728513,1476560427446415362,1476563330491994117,1476437208454209536,1476596149213667337,1476452766738436098]/>

## The Numbers

Here's a quick recap of our launch day stats:

- NFTs minted; 1,124
- Total revenue: 20 ETH
- [Opensea](https://opensea.io/collection/daocentral) volume traded: 12 ETH
- Opensea floor price: ~0.1 ETH (5x mint price)
- Total visitors: 10K
- New registered users: 3K (we're at 4.3K now)
- New [Twitter](https://twitter.com/DAOCentral) followers: 2.5K (we're at 3.5K now)
- New [Discord](https://discord.com/invite/2kztGNQXu8) members: 1K

Some of our costs that went into this project:

- Domain: $700
- NFT Animation: $800
- Smart contract deployment: [$1,100](https://twitter.com/steventey/status/1475150665697554435)
- Miscellaneous (Discord, email tools, [tech stack](https://twitter.com/steventey/status/1463554422022103040), etc.): $200

## Shoutouts

This NFT drop wouldn't have been possible without the help of the following folks/tools:

### NFT Animation

- The main inspiration behind creating founding membership cards came from [Gallery](https://opensea.io/collection/gallery-membership-cards) – a platform for NFT enthusiasts to showcase their collections (s/o to [Mike](https://twitter.com/mikeybitcoin) for being a supporter of our project since day one).
- Other inspirations include [Thirdweb's early access card](https://opensea.io/assets/matic/0xa9e893cc12026a2f6bd826fdb295eac9c18a7e88/0) as well as the elegant [titanium Apple Card](https://youtu.be/03GLhju1yN8?t=128) itself.
- We worked with the talented [Guillermo](https://guillermocastro.myportfolio.com/) to create the animation for the card – he's worked with DeFi companies like [Zerion](https://zerion.io/) in the past.

### Smart Contract

- [Thirdweb](https://thirdweb.com/) was a lifesaver – it allowed us to rapidly build out an MVP without having to learn solidity. Shoutout to [Furqan](https://twitter.com/FurqanR) (who stayed up till 5 AM to help us debug an issue), [Jake](https://twitter.com/jake_loo), [Ayush](https://twitter.com/ayshptk), [Nacho](https://twitter.com/nachoiacovino), and many more for the support!

### Marketing

- [Tally](https://tally.so/) made it painless for us to set up a simple form to start collecting emails, and it scaled really well too. Not to mention that they're built by an indie team and have amazing support (s/o to [Filip](https://twitter.com/filipminev) and [Marie](https://twitter.com/mariemartens)).
- [Flodesk](https://flodesk.com/) – HUGE shouout to them for saving our asses after Mailchimp & Sendgrid _charged us a subscription fee and then proceeded to deny us service simply because we are in the crypto industry_. Flodesk also has the best UI/UX in the email marketing space.
- [Plausible](https://plausible.io/) – we've been paying users since day one. They're privacy-focused, ultra-performant, and have a wonderful support team.

### Team

- Massive shoutout to our dev team – Rohail, Rahat, Matias, Maleen, and Seth for jumping on the project last minute and putting in the work to get this shipped in time. They were all 10x engineers that were incredibly dedicated to the mission.
- Equally as important are our community management team – shoutout to [Adebayo](https://twitter.com/alamu_adebayo) and [Kelly](https://twitter.com/kelly__kimm) for staying up with us and dealing with the onslaught of Discord messages during launch day.

## Some Takeaways

1. **Leverage your network.** Word of mouth can be very powerful when done right. For us, Twitter was a great starting point for acquiring new users, but secondary networks like Discord and YouTube was where the compounding effect took place.
2. **Build cool sh\*t and people will come.** Even better, build it in public. People love founders/teams that are transparent and open about what they're building and why they're building it.
3. **Don’t aim for perfection.** When you're building a product as a small team, don't worry about scale or a complete feature set. We outlined a set of features and marked them as must-have's vs nice-to-have's. Remember Reid Hoffman's quote – *"If you are not embarrassed by the first version of your product, you've launched too late."*
4. **Timing matters, but it shouldn’t be a limiting factor.** We've heard from people about how it "took guts to launch during a holiday". For us, we treated it as a holiday hackathon project and shipped it anyways, and it worked out pretty well.
