import { z } from "zod";

export const donationSchema = z.object({
  amount: z.number().min(1, "请选择或输入捐赠金额"),
  name: z.string().min(2, "请输入至少2个字符的姓名"),
  email: z.string().email("请输入有效的邮箱地址"),
  graduationYear: z
    .string()
    .optional()
    .refine((val) => !val || (val.length === 4 && /^\d{4}$/.test(val)), {
      message: "入学年份应为4位数字",
    }),
  major: z.string().optional(),
  message: z.string().optional(),
  paymentMethod: z.enum(["zelle", "card", "zeffy"], {
    required_error: "请选择支付方式",
  }),
});

export type DonationFormData = z.infer<typeof donationSchema>;
