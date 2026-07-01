import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'skills/uds-showroom/rules/ionos');
mkdirSync(root, { recursive: true });

// [slug, displayName, category, aliases[]]
const STUBS = [
  ['email-address-maker', 'Email address maker', 'email-office', []],
  ['hosted-exchange', 'Hosted Microsoft Exchange', 'email-office', ['exchange']],
  ['email-marketing', 'Email Marketing', 'email-office', []],
  ['nextcloud-workspace', 'Nextcloud Workspace', 'email-office', ['nextcloud']],
  ['microsoft-365', 'Microsoft 365 / Office 365', 'email-office', ['office 365', 'm365']],
  ['google-workspace', 'Google Workspace', 'email-office', []],
  ['managed-nextcloud', 'Managed Nextcloud storage & backup', 'email-office', []],
  ['hidrive', 'HiDrive Cloud-Speicher', 'email-office', ['hidrive cloud']],
  ['email-archiving', 'Email Archivierung', 'email-office', ['email archiving']],
  ['mydefender', 'MyDefender', 'email-office', []],
  ['hidrive-share', 'HiDrive share', 'email-office', []],
  ['website-design-services', 'Website design services', 'website-tools', []],
  ['seo', 'Search engine optimization', 'website-tools', ['search engine optimization']],
  ['google-ads-management', 'Google ads management service', 'website-tools', ['google ads']],
  ['abmahnschutz', 'Website Abmahnschutz', 'website-tools', []],
  ['inbox-ads', 'Inbox ads', 'website-tools', []],
  ['ecommerce-plugin', 'E-commerce plugin', 'ecommerce', ['ecommerce plugin']],
  ['social-buy-button', 'Social Buy button', 'ecommerce', []],
  ['ipayment', 'ipayment', 'ecommerce', []],
  ['woocommerce-hosting', 'Hosting for WooCommerce', 'ecommerce', ['woocommerce hosting']],
  ['prestashop-hosting', 'PrestaShop Hosting', 'ecommerce', ['prestashop']],
  ['wordpress-hosting', 'Hosting for WordPress', 'wordpress', ['wordpress hosting']],
  ['woocommerce-for-wordpress', 'WooCommerce for WordPress', 'wordpress', []],
  ['webhosting', 'Webhosting', 'hosting', ['web hosting']],
  ['deploy-now', 'Static website Deploy Now', 'hosting', ['deploy now']],
  ['vps-hosting', 'VPS Hosting', 'hosting', []],
  ['jamstack-hosting', 'Jamstack Hosting', 'hosting', ['jamstack']],
  ['joomla-hosting', 'Joomla! Hosting', 'hosting', ['joomla']],
  ['contao-hosting', 'Contao Hosting', 'hosting', ['contao']],
  ['vserver-vps', 'vServer (VPS)', 'server', ['vserver']],
  ['dedicated-server', 'Dedicated Server', 'server', []],
  ['bare-metal-server', 'Bare Metal Server', 'server', ['bare metal']],
  ['n8n-vps-hosting', 'n8n VPS Hosting', 'server', ['n8n']],
  ['openclaw-vps-hosting', 'OpenClaw VPS Hosting', 'server', ['openclaw']],
  ['gpu-server', 'GPU Server', 'server', ['gpu']],
  ['cloud-backup', 'Cloud Backup', 'server', []],
  ['public-cloud', 'Public Cloud', 'cloud', []],
  ['private-cloud', 'Private Cloud', 'cloud', []],
  ['backup-storage', 'Backup & storage', 'cloud', []],
  ['compute-engine', 'Compute Engine', 'cloud', ['compute']],
];

for (const [slug, displayName, category, aliases] of STUBS) {
  const f = join(root, `${slug}.md`);
  if (existsSync(f)) continue; // never clobber a personified file
  const al = JSON.stringify(aliases);
  writeFileSync(f, `---\ndisplayName: "${displayName}"\ncategory: ${category}\naiTier: 2\naliases: ${al}\nfigmaRefs: []\n---\n`);
}
console.log(`seeded ${STUBS.length} non-AI stubs`);
