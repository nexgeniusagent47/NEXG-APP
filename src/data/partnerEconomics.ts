import type { Language } from './translations';

/** Commercial assumptions shown by the existing partner earnings estimators. */
export const PARTNER_ECONOMICS = {
  courierRateKesPerKm: 95,
  courierRateNoticeHours: 48,
  propertyMarkupSharePercent: 18,
  propertyShareNoticeDays: 14,
} as const;

const numberLocale: Record<Language, string> = {
  en: 'en-KE',
  zh: 'zh-CN',
  sw: 'sw-KE',
  ar: 'ar-KE',
};

export function formatKes(amount: number, language: Language): string {
  return new Intl.NumberFormat(numberLocale[language], {
    style: 'currency',
    currency: 'KES',
    currencyDisplay: 'code',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatLocalizedNumber(amount: number, language: Language): string {
  return new Intl.NumberFormat(numberLocale[language], { maximumFractionDigits: 1 }).format(amount);
}

export function interpolatePartnerCopy(
  copy: string,
  values: Record<string, string | number>,
): string {
  return copy.replace(/\{(\w+)\}/g, (placeholder, key: string) => String(values[key] ?? placeholder));
}

/** Localized copy used only by the two existing partner earnings estimators. */
export const partnerEconomicsCopy: Record<Language, {
  courier: {
    heading: string;
    deliveriesPerDayLabel: string;
    averageTipPerDelivery: string;
    distancePerDelivery: string;
    ordersPerDay: string;
    estimatedDaily: string;
    weekly: string;
    monthly: string;
    rateNotice: string;
    estimateBasis: string;
  };
  property: {
    heading: string;
    explainer: string;
    rooms: string;
    occupancy: string;
    markupShareLabel: string;
    averageMarkupPerOrder: string;
    estimatedMonthlyShare: string;
    noticePeriodLabel: string;
    noticePeriodValue: string;
    estimatedMonthlyOrders: string;
    totalEstimatedMarkup: string;
    rateNotice: string;
    estimateBasis: string;
  };
}> = {
  en: {
    courier: {
      heading: 'Courier Earnings Estimator',
      deliveriesPerDayLabel: 'Deliveries per day',
      averageTipPerDelivery: 'Optional average tip per delivery',
      distancePerDelivery: 'Average distance per delivery',
      ordersPerDay: 'orders',
      estimatedDaily: 'Estimated daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      rateNotice: 'Courier rate: {rate} per kilometre. The rate may change; riders will receive at least {notice} hours’ notice before a change takes effect.',
      estimateBasis: 'Illustrative estimate: deliveries per day × selected kilometres per delivery × {rate}/km, plus any optional tips you enter. Weekly and monthly totals assume 5 and 22 active days.',
    },
    property: {
      heading: 'Property Earnings Estimator',
      explainer: 'Property owners receive {share}% of all markup on orders placed through NEXG.',
      rooms: 'Rooms',
      occupancy: 'Occupancy',
      markupShareLabel: 'Property share of order markup',
      averageMarkupPerOrder: 'Average markup per order',
      estimatedMonthlyShare: 'Estimated monthly property share',
      noticePeriodLabel: 'Notice before a share change',
      noticePeriodValue: '{days} days',
      estimatedMonthlyOrders: 'Estimated orders per month',
      totalEstimatedMarkup: 'Estimated order markup total',
      rateNotice: 'The property share may change. Property owners will receive at least {notice} days’ notice before a change takes effect.',
      estimateBasis: 'Illustrative estimate: monthly orders are approximated from room occupancy, an average 3-night stay, and one order per estimated stay. The property share is {share}% of all order markup.',
    },
  },
  zh: {
    courier: {
      heading: '配送员收入估算器',
      deliveriesPerDayLabel: '每日配送单数',
      averageTipPerDelivery: '每单预计小费（可选）',
      distancePerDelivery: '每单平均配送距离',
      ordersPerDay: '单',
      estimatedDaily: '预计每日收入',
      weekly: '每周',
      monthly: '每月',
      rateNotice: '配送费率：每公里 {rate}。费率可能调整；新费率生效前至少 {notice} 小时通知骑手。',
      estimateBasis: '示例估算：每日配送单数 × 每单所选公里数 × {rate}/公里，再加上您填写的可选小费。每周和每月分别按 5 天和 22 天工作计算。',
    },
    property: {
      heading: '物业收入估算器',
      explainer: '通过 NEXG 下单产生的全部加价中，{share}% 将分给物业业主。',
      rooms: '客房数',
      occupancy: '入住率',
      markupShareLabel: '全部订单加价中的物业分成',
      averageMarkupPerOrder: '每笔订单平均加价',
      estimatedMonthlyShare: '预计物业月度分成',
      noticePeriodLabel: '分成比例变更通知期',
      noticePeriodValue: '{days} 天',
      estimatedMonthlyOrders: '预计每月订单数',
      totalEstimatedMarkup: '预计订单加价总额',
      rateNotice: '物业分成比例可能调整；新比例生效前至少 {notice} 天通知物业业主。',
      estimateBasis: '示例估算：月订单量根据客房入住率、平均入住 3 晚以及每次预计入住 1 笔订单计算。物业分成为所有订单加价的 {share}%。',
    },
  },
  sw: {
    courier: {
      heading: 'Kikokotoo cha Mapato ya Msafirishaji',
      deliveriesPerDayLabel: 'Oda kwa siku',
      averageTipPerDelivery: 'Wastani wa bakshishi kwa kila oda (hiari)',
      distancePerDelivery: 'Wastani wa kilomita kwa kila oda',
      ordersPerDay: 'oda',
      estimatedDaily: 'Makadirio ya kila siku',
      weekly: 'Kila wiki',
      monthly: 'Kila mwezi',
      rateNotice: 'Kiwango cha msafirishaji: {rate} kwa kila kilomita. Kiwango kinaweza kubadilika; waendeshaji watajulishwa angalau saa {notice} kabla ya mabadiliko kuanza.',
      estimateBasis: 'Makadirio ya mfano: oda kwa siku × kilomita ulizochagua kwa kila oda × {rate}/km, pamoja na bakshishi zozote za hiari utakazoweka. Jumla za wiki na mwezi zinakadiria siku 5 na 22 za kazi.',
    },
    property: {
      heading: 'Kikokotoo cha Mapato ya Jengo',
      explainer: 'Wamiliki wa majengo hupokea {share}% ya nyongeza zote za bei za oda zilizowekwa kupitia NEXG.',
      rooms: 'Vyumba',
      occupancy: 'Kiwango cha matumizi ya vyumba',
      markupShareLabel: 'Sehemu ya jengo ya nyongeza zote za bei za oda',
      averageMarkupPerOrder: 'Wastani wa nyongeza ya bei kwa kila oda',
      estimatedMonthlyShare: 'Makadirio ya sehemu ya jengo kwa mwezi',
      noticePeriodLabel: 'Muda wa taarifa kabla ya mabadiliko ya mgao',
      noticePeriodValue: 'siku {days}',
      estimatedMonthlyOrders: 'Makadirio ya oda kwa mwezi',
      totalEstimatedMarkup: 'Jumla ya makadirio ya nyongeza za bei',
      rateNotice: 'Sehemu ya jengo inaweza kubadilika. Wamiliki wa majengo watajulishwa angalau siku {notice} kabla mabadiliko kuanza.',
      estimateBasis: 'Makadirio ya mfano: oda za mwezi hukadiriwa kutokana na matumizi ya vyumba, wastani wa kukaa usiku 3 na oda moja kwa kila ukaaji unaokadiriwa. Sehemu ya jengo ni {share}% ya nyongeza zote za bei za oda.',
    },
  },
  ar: {
    courier: {
      heading: 'حاسبة أرباح التوصيل',
      deliveriesPerDayLabel: 'عمليات التوصيل يومياً',
      averageTipPerDelivery: 'متوسط الإكرامية لكل طلب (اختياري)',
      distancePerDelivery: 'متوسط مسافة التوصيل لكل طلب',
      ordersPerDay: 'طلبات',
      estimatedDaily: 'التقدير اليومي',
      weekly: 'أسبوعياً',
      monthly: 'شهرياً',
      rateNotice: 'أجر التوصيل: {rate} لكل كيلومتر. قد يتغير الأجر؛ وسيُخطر السائقون قبل سريان أي تغيير بما لا يقل عن {notice} ساعة.',
      estimateBasis: 'تقدير توضيحي: عدد الطلبات يومياً × الكيلومترات المحددة لكل طلب × {rate} لكل كيلومتر، إضافة إلى أي إكراميات اختيارية تُدخلها. يفترض التقدير الأسبوعي 5 أيام عمل والشهري 22 يوماً.',
    },
    property: {
      heading: 'حاسبة دخل المنشأة',
      explainer: 'يحصل مالكو المنشآت على {share}% من جميع هوامش زيادة أسعار الطلبات المقدمة عبر NEXG.',
      rooms: 'عدد الغرف',
      occupancy: 'نسبة الإشغال',
      markupShareLabel: 'حصة المنشأة من جميع هوامش زيادة الطلبات',
      averageMarkupPerOrder: 'متوسط هامش الزيادة لكل طلب',
      estimatedMonthlyShare: 'الحصة الشهرية المقدرة للمنشأة',
      noticePeriodLabel: 'مهلة الإخطار قبل تغيير الحصة',
      noticePeriodValue: '{days} يوماً',
      estimatedMonthlyOrders: 'الطلبات المقدرة شهرياً',
      totalEstimatedMarkup: 'إجمالي هامش زيادة الأسعار المقدر',
      rateNotice: 'قد تتغير حصة المنشأة. وسيُخطر المالكون قبل سريان أي تغيير بما لا يقل عن {notice} يوماً.',
      estimateBasis: 'تقدير توضيحي: يُقدّر عدد الطلبات الشهرية بناءً على إشغال الغرف ومتوسط إقامة قدره 3 ليالٍ وطلب واحد لكل إقامة مقدرة. حصة المنشأة هي {share}% من جميع هوامش زيادة أسعار الطلبات.',
    },
  },
};
