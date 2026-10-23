export function getLocalChatResponse(_query: string): string {
  return [
    "### Chưa đủ căn cứ để xác nhận nội dung pháp lý",
    "",
    "Trợ lý AI hiện không khả dụng hoặc chưa trả về câu trả lời có thể sử dụng. Bộ dự phòng trên trình duyệt không thực hiện tra cứu văn bản pháp luật trực tiếp, nên không đưa ra kết luận về điều khoản, hiệu lực, thời hạn hoặc thẩm quyền.",
    "",
    "Để tiếp tục, hãy cung cấp văn bản pháp luật hoặc đường dẫn đến nguồn chính thức cần đối chiếu. Cần kiểm tra văn bản gốc, văn bản sửa đổi/bãi bỏ, ngày hiệu lực và phạm vi áp dụng trước khi sử dụng kết quả.",
    "",
    "Mọi kết quả hỗ trợ chỉ có tính chất tham khảo; công chức có thẩm quyền phải kiểm tra và quyết định."
  ].join("\n");
}
