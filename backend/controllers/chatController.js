// Enhanced responses with more keywords and categories
const responses = {
  greetings: {
    keywords: [
      "hi",
      "hello",
      "hey",
      "good morning",
      "good evening",
      "good afternoon",
    ],
    response: "Hello! Welcome to TimberCraft. How may I help you today? 👋",
  },
  custom: {
    keywords: ["self order", "custom", "self", "book", "custom ordering"],
    response:
      "You can order a product by going on home page and selecting the custom order option on the very top of page below navigation bar",
  },
  products: {
    keywords: [
      "product",
      "products",
      "collection",
      "category",
      "wood",
      "price range",
      "furnitures",
      "furniture",
    ],
    response:
      "Our Products are all listed in collection page. You can find a wide range of furnitures at affordable price range.\n\nYou can also understand about the categories and woods on the homepage",
  },
  pricing: {
    keywords: ["price", "cost", "rate", "charges", "fee", "expensive", "cheap"],
    response:
      "We offer wide range of products at a reasonable rate for our valuable customers. The custom orders are also transparent with reasonable price range.",
  },
  about: {
    keywords: ["help", "browse", "find", "search"],
    response:
      "Timber Craft is a online furniture business.\n more about us is in about us page\n You can browse products in collection page\n add custom orders from home page\n you can search for products using search bar\n filter product browing using filters",
  },
  location: {
    keywords: ["where", "location", "address", "direction", "find", "reach"],
    response:
      "We are located at [college_address] Bhagwati Marg, Near City Center. You can view our map at contact page",
  },

  payment: {
    keywords: ["pay", "payment", "card", "cash", "credit", "debit", "refund"],
    response:
      "We currently just accept cash payment or online payment via E-sewa. Sorry for the inconvenience. We are working on adding more payment methods soon.",
  },
  default: {
    response:
      "I'm not sure about that. You can ask me about:\n• products\n• Prices\n• Custom ordering\n• Location\n• about us\n• Payment methods",
  },
};

// Chat logic
export const handleChat = (req, res) => {
  const userMessage = req.body.message.toLowerCase();
  let response = responses.default.response;

  // Check each category for matching keywords
  for (const category in responses) {
    if (category !== "default") {
      const matchedKeyword = responses[category].keywords?.some((keyword) =>
        userMessage.includes(keyword)
      );

      if (matchedKeyword) {
        response = responses[category].response;
        break;
      }
    }
  }

  res.json({ response });
};
