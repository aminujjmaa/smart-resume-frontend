/** Resume builder templates that need Pro. Used by the gallery and the builder. */
export const PRO_TEMPLATE_IDS = new Set(["senior-engineer", "product-manager", "devops-infra"]);

export function isProTemplate(templateId: string): boolean {
  return PRO_TEMPLATE_IDS.has(templateId);
}
