export const DEFAULT_SITE_SETTINGS = {
  heroTitle: "支持浙大大纽约校友会",
  heroSubtitle: "您的慷慨捐赠将帮助我们实现使命，传承求是精神",
  heroImageUrl:
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80",
  donationStoryTitle: "捐赠故事",
  donationStoryP1:
    "浙大大纽约校友会成立于2010年，校友会自成立以来组织校友们参与了各项线上线下活动，为大纽约地区的校友们牵线搭桥，继承和发扬母校优良传统与校风，加强联系，进一步增进情谊及合作。",
  donationStoryP2:
    "作为非盈利组织，校友会的日常运作是基于热心校友们的慷慨捐赠，和志愿者的无私奉献。我们感谢每一位曾经或者正在为校友会工作作出贡献的校友！",
  transparencyTitle: "资金透明度",
  transparencyIntro: "您的捐赠将用于以下方面：",
  transparencyItems: [
    "校友会组织或赞助的线上线下活动",
    "网站及沟通平台等基础设施改进",
    "支持校友会日常运营的各类支出",
  ],
  zelleEmail: "zjuacny@gmail.com",
  zelleQrImageUrl: "", // 留空则使用邮箱自动生成；填入图片 URL 则显示自定义二维码（如微信/支付宝）
  zeffyDonationUrl: "", // Zeffy 捐赠页面链接，管理员在后台配置
  zeffyQrImageUrl: "", // Zeffy 二维码图片 URL，留空则根据 zeffyDonationUrl 自动生成
  navBrand: "浙大大纽约校友会",
  siteTitle: "捐赠 Donation | 浙大大纽约校友会",
  siteDescription:
    "支持浙大大纽约校友会 - 您的慷慨捐赠将帮助我们实现使命，支持校友社区，传承求是精神。",
} as const;

export type SiteSettingsKey = keyof typeof DEFAULT_SITE_SETTINGS;
