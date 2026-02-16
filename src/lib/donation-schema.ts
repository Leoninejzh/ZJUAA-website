import { z } from "zod";

export const donationSchema = z.object({
  amount: z.number().min(1, "请选择或输入捐赠金额"),
  name: z.string().min(2, "请输入至少2个字符的姓名"),
  email: z.string().email("请输入有效的邮箱地址"),
  graduationYear: z
    .string()
    .min(4, "请输入入学年份")
    .max(4, "入学年份应为4位数字")
    .regex(/^\d{4}$/, "入学年份应为4位数字"),
  major: z.string().min(2, "请输入专业名称"),
  message: z.string().optional(),
  paymentMethod: z.enum(["zelle", "card"], {
    required_error: "请选择支付方式",
  }),
});

export type DonationFormData = z.infer<typeof donationSchema>;
