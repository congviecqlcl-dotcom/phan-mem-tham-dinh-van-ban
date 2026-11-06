export const LOCAL_FALLBACK_NOTICE =
  "Không thể hoàn tất thẩm định bằng AI; kết quả dưới đây do bộ quy tắc cục bộ tạo ra và cần công chức kiểm tra.";

export function createLocalFallbackResponse<T>(
  id: unknown,
  name: unknown,
  auditResult: T,
) {
  return {
    id,
    name,
    success: false,
    source: "local_fallback" as const,
    sourceNotice: LOCAL_FALLBACK_NOTICE,
    auditResult,
  };
}
