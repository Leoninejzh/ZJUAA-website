/**
 * 生成 Admin 密码的 bcrypt 哈希
 * 用法: node scripts/hash-password.js your_password
 */
const { hashSync } = require("bcryptjs");

const password = process.argv[2];
if (!password) {
  console.error("用法: node scripts/hash-password.js <密码>");
  process.exit(1);
}

const hash = hashSync(password, 10);
console.log("\n将以下内容添加到 .env.local:\n");
console.log(`ADMIN_PASSWORD_HASH=${hash}`);
console.log("\n");
