import { Card, CardContent } from "@/components/ui/card";
import { Marquee } from "@/components/ui/marquee-03-utils/marquee";

export type Review = {
  name: string;
  username: string;
  body: string;
  rating?: number;
};

export const reviews: Review[] = [
  {
    name: "Kankana Talukdar",
    username: "@kankana_t",
    body: "The ambience was pretty cute and aesthetic. We tried their Strawberry Boba Rush, By the Bay with Boba in drinks, Mini Bento Chicken, Chicken Ramen & Korean Corn Dog. The food was good and definitely worth giving a try. The service was a bit slow but the food and the ambience made up for it.",
    rating: 5,
  },
  {
    name: "DR",
    username: "@dr_reviews",
    body: "Ambience is very pretty. Food was okay. The noodles in jajjanmyeon was not cooked properly. Bibimbap and fried chicken were fine. There was an aftertaste in the chicken which I think may be an excess of oyester sauce that kinda watered down the initial kick.",
    rating: 4,
  },
  {
    name: "Kankana Roy",
    username: "@kankana.roy",
    body: "This café offers a warm and welcoming atmosphere with a beautifully designed interior. The elegant décor, cozy seating, soft lighting, and thoughtfully chosen details create the perfect place to relax. Every corner is stylish and inviting, making it a great spot to enjoy good coffee, delicious food, and quality time with friends or family.",
    rating: 5,
  },
  {
    name: "Nitin das",
    username: "@nitin_das",
    body: "Asthetic 2d themed cafe great spot for hangout with friends or date with your partner. They provide good delights definitely recommended, service is good too, overall really a fine place to chill/hangout/date, and totally instagrammable spot for pictures 👍💯",
    rating: 5,
  },
  {
    name: "Aparna Barman",
    username: "@aparna_barman",
    body: "The ambience is peaceful and nicely maintained. Perfect for lunch or dinner with friends family or even colleagues. We ordered strawberry matcha latte, ramen, and pink mandu . Tbh this was my first time that I tried matcha and it was fabulous 😍",
    rating: 5,
  },
  {
    name: "Manashi Patowary",
    username: "@manashi_p",
    body: "Bite and Beans offers a charming, intimate dining experience with a refined and inviting ambience. I visited with my nephew and we enjoyed shrimp,wings, hot chocolate, and a latte — each item was well-prepared and satisfying. It’s impressive that they also serve Korean and Japanese cuisine, adding a unique touch to their menu.",
    rating: 5,
  },
  {
    name: "Dr. Meghna Gogoi",
    username: "@dr_meghna",
    body: "Harry Potter theme !!!! Just what I wanted for my 8 year old Potterhead … and I loved everything - the staff, food , the smiling faces,the vibe and of course the ATMOSPHERE… will visit again for sure",
    rating: 5,
  },
  {
    name: "Neha",
    username: "@neha_hangout",
    body: "The food was simply amazing. It is a big pricey but a good hangout spot for friends and couples! Their drinks are so aesthetic and their chicken is really crispy.",
    rating: 5,
  },
  {
    name: "Dimpi Das",
    username: "@dimpi_das",
    body: "Quaint little place tucked at the very end of the road but within seconds it was bustling with people and it was the food which explained the rush. The food tasted like authentic South East Asian food. Don’t have only 1 corn dog, always go for multiple. The big momo was ok. Chicken Katsu tasted great. We finished off with Bibimbap and Mini Bento. Matcha Latte and By da Bae drinks were stunning.",
    rating: 5,
  },
  {
    name: "It's DVP Dhanushree Phatak",
    username: "@its_dvp",
    body: "Good Ambience, but a bit small space. Food is good. Had great time there. There are vegan options for some dishes.",
    rating: 4,
  },
  {
    name: "Bhawana Sarma",
    username: "@bhawana_sarma",
    body: "What an evening! The food just hit the right spot. We tried their Matcha and Cafe Caramello for drinks, Buldak Hot wings, Jumbo pink mandus for starters and Seafood Bento Box and Chicken Tteobokki for maincourse. The ambiance is really nice. It is just next to Rajgarh Rail line.",
    rating: 5,
  },
  {
    name: "Newton",
    username: "@newton_cafe",
    body: "I finally visited this cafe after a long time, and it was totally worth it! I ordered Bibimbap and Ramen oh my god, both were so, so, so good! I also had a Peach Tea, and it honestly made me so happy because it’s really hard to find a good one. Most places don’t get the peach flavor right for me, but the moment I took a sip here, its exactly the taste I love!",
    rating: 5,
  },
  {
    name: "Sunandanna Choudhury",
    username: "@sunandanna_c",
    body: "We ordered Chicken Wings with Cheese, Chicken Rabokki, Bibimbap, Cheese Corn Dog, & Hot Chocolate. Among all these, the Chicken Wings were the Best. The hot chocolate was fine. Rabokki was okay. Nice place to try Asian comfort snacks.",
    rating: 4,
  },
  {
    name: "Toisha Ahmed",
    username: "@toisha_ahmed",
    body: "Bites and Bean Café is an absolute delight! The atmosphere is warm and inviting, making it a perfect spot to relax. The service was well-organized, friendly, and genuinely impressive. And the food? Truly amazing — great quality and delicious in every bite. This café is definitely a must-visit place!",
    rating: 5,
  },
  {
    name: "Subham Mandal",
    username: "@subham_mandal",
    body: "Quantity wise the food is less but taste wise not bad. Provides a limited korean meal. Although it is cute, very pretty, the ambience is worth noting actually so if you're into ambience I would suggest this place. The 2D decor makes it super unique in Guwahati.",
    rating: 4,
  },
  {
    name: "Ashma Begum",
    username: "@ashma_begum",
    body: "One of my favourite ramen cafe ever . When ever i want to eat ramen i simply choose this cafe. best ramen.",
    rating: 5,
  },
  {
    name: "Natasha Kalita",
    username: "@natasha_kalita",
    body: "Overall, the aesthetic is pleasing, with a royal museum-style touch on the walls. The ramen and toppings have nice flavor. The cafe has a cozy 2D sketchbook charm that stands out in Guwahati.",
    rating: 4,
  },
  {
    name: "Dikshita Deka",
    username: "@dikshita_deka",
    body: "This cafe is such a cozy and aesthetic cafe the interiors are beautiful and make the whole vibe so relaxing. I tried their Vegan Tteokbokki, Chicken Korean Kimbap, Classic Cheese Corndog, Kimchi, Iced Hibiscus Tea, and Mocha – everything was fresh, flavorful, and beautifully served. A perfect spot for delicious food and good vibes💓",
    rating: 5,
  },
  {
    name: "Sukanya Duwarah",
    username: "@sukanya_d",
    body: "Everything was good, including the ramen and corndog we had. The vibe of the café is good otherwise, and the ramen was also tasty. Definitely a nice place to hang out with friends.",
    rating: 4,
  },
  {
    name: "Esha Esha",
    username: "@esha_reviews",
    body: "Pretty cafe with pretty interiors. Aesthetic spot with Korean and Japanese delights. A great hangout spot for photography and relaxing with friends.",
    rating: 4,
  },
  {
    name: "Shirley Sangma",
    username: "@shirley_sangma",
    body: "Had a wonderful experience at Bite & Beans 2D Cafe House! The ambience is so cozy, dreamy, and perfect for taking pictures. We really enjoyed the food and drinks everything was fresh and delicious. The chicken wings were definitely our favorite, and the ramen was also very tasty. The service was friendly and attentive, which made our visit even better. Highly recommended! ❤️✨",
    rating: 5,
  },
  {
    name: "Supratik Bora",
    username: "@supratik_bora",
    body: "What a lovely experience we had at Bites and Beans today. The moment you enter through the door, it's like stepping into a different world. Seriously, the aesthetic of this place is on another level. The 2D style is extremely fascinating. The chicken wings were crispy on the outside and juicy on the inside, and the ramen was really tasty. I would definitely visit again!",
    rating: 5,
  },
];

const ReviewCard = ({ name, username, body, rating = 5 }: Review) => {
  return (
    <Card className="relative w-full max-w-sm cursor-pointer overflow-hidden border border-[#1a1a1a]/15 bg-white shadow-[2px_2px_0px_#1a1a1a] p-4 transition-all duration-300 hover:border-[#8B2635] hover:shadow-[4px_4px_0px_#8B2635] hover:-translate-y-1">
      <CardContent className="p-0 flex flex-col gap-2.5">
        <div className="flex flex-row items-center gap-2.5">
          {/* Default empty user profile icon (Instagram / Google style silhouette) */}
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 border border-slate-200"
            aria-hidden="true"
          >
            <svg
              className="h-5 w-5 fill-current opacity-70"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <p className="text-sm font-semibold text-[#1A1A1A] truncate">
                {name}
              </p>
              <div className="flex text-[#FBBC04] text-xs">
                {Array.from({ length: rating }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
            </div>
            <p className="text-xs font-medium text-slate-500 truncate">
              {username}
            </p>
          </div>
        </div>
        <p className="text-[13px] text-[#374151] leading-relaxed line-clamp-6">
          {body}
        </p>
      </CardContent>
    </Card>
  );
};

const VerticalMarqueeDemo = () => {
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
      {/* Restored script badge */}
      <div className="text-center mb-6">
        <span
          className="inline-block text-[#8B2635] text-3xl md:text-4xl"
          style={{ fontFamily: "'Great Vibes', cursive" }}
        >
          Words from our Guests
        </span>
      </div>

      {/* Marquee Track Container with Vignettes */}
      <div className="relative flex h-[520px] w-full flex-row items-center justify-center overflow-hidden rounded-2xl bg-[#F5F4F0]/70 border border-[#1a1a1a]/10 backdrop-blur-xs">
      <div className="flex flex-row items-center justify-center w-full gap-4 px-4 h-full">
        {/* Column 1 - Smooth Leisurely 110s Duration */}
        <Marquee
          pauseOnHover
          vertical
          className="[--duration:110s] h-full sm:flex hidden flex-1"
        >
          {reviews
            .filter((_, i) => i % 3 === 0)
            .map((review, idx) => (
              <ReviewCard key={idx} {...review} />
            ))}
        </Marquee>

        {/* Column 2 - Reverse Scroll with 110s Duration */}
        <Marquee
          reverse
          pauseOnHover
          vertical
          className="[--duration:110s] h-full hidden sm:flex flex-1"
        >
          {reviews
            .filter((_, i) => i % 3 === 1)
            .map((review, idx) => (
              <ReviewCard key={idx} {...review} />
            ))}
        </Marquee>

        {/* Column 3 - Smooth 110s Duration on Large Screens */}
        <Marquee
          pauseOnHover
          vertical
          className="[--duration:110s] h-full hidden lg:flex flex-1"
        >
          {reviews
            .filter((_, i) => i % 3 === 2)
            .map((review, idx) => (
              <ReviewCard key={idx} {...review} />
            ))}
        </Marquee>

        {/* Mobile Single Column */}
        <Marquee
          pauseOnHover
          vertical
          className="[--duration:110s] h-full sm:hidden flex flex-1"
        >
          {reviews.map((review, idx) => (
            <ReviewCard key={idx} {...review} />
          ))}
        </Marquee>
      </div>

      {/* Top and Bottom gradient vignettes */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#F5F4F0] via-[#F5F4F0]/85 to-transparent z-10"></div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#F5F4F0] via-[#F5F4F0]/85 to-transparent z-10"></div>
    </div>
    </div>
  );
};

export default VerticalMarqueeDemo;
