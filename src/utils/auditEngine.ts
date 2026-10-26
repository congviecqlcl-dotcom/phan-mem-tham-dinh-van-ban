import { AuditResult, AuditIssue, IssueCategory, DocumentType } from '../types';

export function runClientAuditEngine(content: string, docType?: DocumentType | string, fileName?: string): AuditResult {
  const issues: AuditIssue[] = [];
  const lower = content.toLowerCase();
  const lowerName = (fileName || '').toLowerCase();

  // Determine detected document type
  let documentTypeDetected = 'Văn bản hành chính';
  if (docType === 'to_trinh' || lower.includes('tờ trình') || lowerName.includes('to_trinh')) {
    documentTypeDetected = 'Tờ trình (Nghị định 30/2020)';
  } else if (docType === 'quyet_dinh' || lower.includes('quyết định') || lowerName.includes('quyet_dinh')) {
    documentTypeDetected = 'Quyết định hành chính (Nghị định 30/2020)';
  } else if (docType === 'cong_van' || lower.includes('kính gửi:') || lower.includes('công văn')) {
    documentTypeDetected = 'Công văn hành chính (Nghị định 30/2020)';
  } else if (docType === 'bien_ban' || lower.includes('biên bản')) {
    documentTypeDetected = 'Biên bản thẩm định / làm việc';
  } else if (docType === 'tu_cong_bo' || lower.includes('bản tự công bố')) {
    documentTypeDetected = 'Bản tự công bố sản phẩm (NĐ 15/2018)';
  } else if (docType === 'nhan_hang_hoa' || lower.includes('nhãn') || lower.includes('thực phẩm bảo vệ sức khỏe')) {
    documentTypeDetected = 'Nhãn hàng hóa / TPCN (NĐ 111/2021)';
  } else if (docType === 'ban_cam_ket' || lower.includes('bản cam kết')) {
    documentTypeDetected = 'Bản cam kết sản xuất kinh doanh ATTP (TT 17/2018)';
  }

  // 1. Thể thức NĐ 30: Trích yếu Quyết định / Tờ trình dùng sai cụm "V/v"
  if (
    (lower.includes('quyết định') || docType === 'quyet_dinh' || lower.includes('tờ trình') || docType === 'to_trinh') &&
    /quyết\s*định\s*\n+v\/v|tờ\s*trình\s*\n+v\/v/i.test(content)
  ) {
    issues.push({
      id: 'err-thethuc-vv-qd',
      category: 'the_thuc',
      severity: 'error',
      title: "Trích yếu văn bản có tên loại sử dụng sai chữ viết tắt 'V/v'",
      currentContent: 'QUYẾT ĐỊNH\nV/v ... (hoặc TỜ TRÌNH\nV/v ...)',
      expectedContent: 'QUYẾT ĐỊNH\nVề việc ... (in thường, đứng, đậm, có đường kẻ ngang 1/3-1/2 phía dưới)',
      legalBasis: 'Điểm b Khoản 5 Mục II Phần I & Mẫu 1.2 Phụ lục III Nghị định số 30/2020/NĐ-CP',
      explanation:
        "Văn bản có tên loại (như Quyết định, Nghị quyết, Tờ trình) không dùng cụm từ viết tắt 'V/v'. Chữ 'V/v' chỉ áp dụng duy nhất cho Công văn (tại ô số 5b).",
      location: 'Phần Tiêu đề và Trích yếu văn bản',
    });
  }

  // 2. Viết tắt chức vụ, chức danh sai quy định (PGĐ, GĐ, PCT, CT, CCT, TP, PP, BGD)
  if (
    /\b(pgđ|gđ|pct|cct|bgd)\b/i.test(content) ||
    /các\s+pgđ/i.test(content) ||
    /phó\s+cct/i.test(content) ||
    /phòng\s+tccb/i.test(content) ||
    /phòng\s+qlcl/i.test(content)
  ) {
    issues.push({
      id: 'err-thethuc-viet-tat-chuc-vu',
      category: 'the_thuc',
      severity: 'error',
      title: 'Viết tắt tùy tiện chức vụ, chức danh lãnh đạo và phòng ban',
      currentContent: 'PGĐ Sở, CCT, Phó CCT, Phòng TCCB, Phòng QLCL...',
      expectedContent: 'Phó Giám đốc Sở, Chi cục trưởng, Phó Chi cục trưởng, Phòng Tổ chức cán bộ, Phòng Quản lý chất lượng...',
      legalBasis: 'Khoản 10 Mục II Phần I Phụ lục I Nghị định số 30/2020/NĐ-CP & Quy chuẩn văn thư nhà nước',
      explanation:
        'Trong văn bản hành chính (đặc biệt là phần Nơi nhận và nội dung), nghiêm cấm viết tắt tùy tiện các chức vụ, chức danh lãnh đạo và tên phòng ban. Chỉ được phép viết tắt các từ ngữ theo quy chuẩn pháp luật như TM., KT., TL., TUQ., Q., UBND, HĐND.',
      location: 'Phần Nơi nhận hoặc nội dung văn bản',
    });
  }

  // 3. Viết hoa bừa bãi tên cơ quan (viết hoa chữ Và, Của, Tại, Thuộc)
  if (
    /Bộ\s+Nông\s+Nghiệp\s+Và\s+Phát\s+Triển\s+Nông\s+Thôn/g.test(content) ||
    /Sở\s+Nông\s+Nghiệp\s+Và\s+Môi\s+Trường/g.test(content) ||
    /Ủy\s+Ban\s+Nhân\s+Dân/g.test(content) ||
    /Chi\s+Cục\s+Chất\s+Lượng\s+Chế\s+Biến\s+Và\s+Phát\s+Triển\s+Thị\s+Trường/g.test(content)
  ) {
    issues.push({
      id: 'err-thethuc-viet-hoa-co-quan',
      category: 'the_thuc',
      severity: 'warning',
      title: "Viết hoa sai quy tắc trong tên cơ quan, tổ chức (viết hoa liên từ 'Và', 'Nhân Dân')",
      currentContent: 'Bộ Nông Nghiệp Và Phát Triển Nông Thôn / Sở Nông Nghiệp Và Môi Trường...',
      expectedContent: 'Bộ Nông nghiệp và Phát triển nông thôn / Sở Nông nghiệp và Môi trường / Ủy ban nhân dân...',
      legalBasis: 'Mục II Phụ lục II Nghị định số 30/2020/NĐ-CP (Quy tắc viết hoa tên cơ quan, tổ chức)',
      explanation:
        "Theo Phụ lục II Nghị định 30, chỉ viết hoa chữ cái đầu của các từ, cụm từ chỉ loại hình cơ quan và chức năng; không viết hoa các liên từ 'và', 'của', 'tại' hoặc viết hoa từng từ đơn lẻ theo kiểu tiếng Anh.",
      location: 'Tên cơ quan ban hành hoặc trong viện dẫn',
    });
  }

  // 4. Viết hoa bừa bãi danh từ chung trong câu văn
  if (
    /\b(An\s+Toàn\s+Thực\s+Phẩm|Cơ\s+Sở\s+Sản\s+Xuất|Nông\s+Lâm\s+Thủy\s+Sản|Ngày\s+Cấp:|Mặt\s+Hàng\s+Kinh\s+Doanh:|Mã\s+Doanh\s+Nghiệp:)\b/g.test(content)
  ) {
    issues.push({
      id: 'err-thethuc-viet-hoa-danh-tu-chung',
      category: 'the_thuc',
      severity: 'suggestion',
      title: 'Viết hoa tùy tiện danh từ chung giữa câu văn',
      currentContent: 'An Toàn Thực Phẩm, Cơ Sở Sản Xuất, Nông Lâm Thủy Sản, Ngày Cấp...',
      expectedContent: 'an toàn thực phẩm, cơ sở sản xuất, nông, lâm, thủy sản, Ngày cấp...',
      legalBasis: 'Mục IV Phụ lục II Nghị định số 30/2020/NĐ-CP (Quy tắc viết hoa trong văn bản hành chính)',
      explanation:
        'Nghiêm cấm viết hoa tùy tiện các danh từ chung, thuật ngữ kỹ thuật, ngành nghề khi đứng ở giữa câu văn hành chính.',
      location: 'Phần nội dung văn bản',
    });
  }

  // 5. Kiểm tra từ "đảm bảo" thay vì "bảo đảm"
  if (lower.includes('điều kiện đảm bảo an toàn thực phẩm') || /sản\s+phẩm\s+không\s+đảm\s+bảo/i.test(content) || /nhằm\s+đảm\s+bảo/i.test(content)) {
    issues.push({
      id: 'err-chuyenmon-bao-dam',
      category: 'chuyen_mon_attp',
      severity: 'warning',
      title: "Sử dụng thuật ngữ chưa chuẩn hóa ('đảm bảo' thay vì 'bảo đảm')",
      currentContent: 'điều kiện đảm bảo an toàn thực phẩm',
      expectedContent: 'điều kiện bảo đảm an toàn thực phẩm',
      legalBasis: 'Luật An toàn thực phẩm số 55/2010/QH12 & Thông tư 17/2024/TT-BNNPTNT',
      explanation:
        "Theo chuẩn thuật ngữ pháp lý trong Luật ATTP 2010 và các Thông tư của Bộ NN&PTNT, cụm từ chuẩn quy định là 'bảo đảm an toàn thực phẩm'.",
      location: 'Trích yếu hoặc nội dung văn bản',
    });
  }

  // 6. Kiểm tra viết tắt cơ quan lần đầu trong căn cứ viện dẫn
  if (
    lower.includes('bộ nông nghiệp và ptnt') ||
    lower.includes('bộ nn&ptnt') ||
    lower.includes('sở nn&ptnt') ||
    lower.includes('sở nn&mt') ||
    lower.includes('chế biến và pttt')
  ) {
    issues.push({
      id: 'err-thethuc-viet-tat-can-cu',
      category: 'the_thuc',
      severity: 'warning',
      title: 'Viết tắt tên cơ quan ban hành ngay trong lần viện dẫn đầu tiên',
      currentContent: 'Bộ Nông nghiệp và PTNT / Bộ NN&PTNT / Chế biến và PTTT',
      expectedContent: 'Bộ Nông nghiệp và Phát triển nông thôn / Chế biến và Phát triển thị trường',
      legalBasis: 'Điểm b Khoản 6 Mục II Phần I Phụ lục I Nghị định số 30/2020/NĐ-CP',
      explanation:
        'Khi viện dẫn lần đầu văn bản có liên quan, phải ghi đầy đủ tên loại, số, ký hiệu, thời gian ban hành và tên đầy đủ của cơ quan ban hành văn bản mà không viết tắt.',
      location: 'Phần Căn cứ ban hành hoặc Nơi nhận văn bản',
    });
  }

  // 7. Kiểm tra thiếu chữ "số" ở Quyết định
  if (
    /căn cứ quyết định \d+\/\d+/i.test(content) &&
    !/căn cứ quyết định số \d+\/\d+/i.test(content)
  ) {
    issues.push({
      id: 'err-thethuc-thieu-chu-so',
      category: 'the_thuc',
      severity: 'suggestion',
      title: "Thiếu từ 'số' trong viện dẫn văn bản hành chính",
      currentContent: 'Căn cứ Quyết định 09/2025/QĐ-UBND...',
      expectedContent: 'Căn cứ Quyết định số 09/2025/QĐ-UBND...',
      legalBasis: 'Khoản 6 Mục II Phần I Phụ lục I Nghị định số 30/2020/NĐ-CP',
      explanation: 'Văn bản hành chính khi viện dẫn cần ghi đầy đủ chữ "số" trước số hiệu văn bản.',
      location: 'Phần Căn cứ ban hành',
    });
  }

  // 8. Kiểm tra dấu câu trong Nơi nhận
  if (
    lower.includes('nơi nhận:') &&
    (content.includes('- Giám đốc, các PGĐ Sở.') ||
      content.includes('- Giám đốc, các PGĐ Sở') ||
      content.includes('- Văn phòng Sở.') ||
      content.includes('- Phòng TCCB Sở.'))
  ) {
    issues.push({
      id: 'err-thethuc-dau-cau-noi-nhan',
      category: 'the_thuc',
      severity: 'warning',
      title: 'Dấu câu kết thúc từng dòng nơi nhận chưa chuẩn',
      currentContent: '- Giám đốc, các PGĐ Sở.',
      expectedContent: '- Giám đốc Sở, các Phó Giám đốc Sở;',
      legalBasis: 'Điểm d Khoản 9 Mục II Phần I Phụ lục I Nghị định số 30/2020/NĐ-CP',
      explanation:
        'Trong phần Nơi nhận, cuối mỗi dòng của cơ quan nhận văn bản phải là dấu chấm phẩy (;), chỉ có dòng cuối cùng "Lưu: VT..." mới kết thúc bằng dấu chấm (.).',
      location: 'Phần Nơi nhận (ô số 9b)',
    });
  }

  // 9. Kiểm tra mục Lưu văn bản
  if (lower.includes('lưu: vt, hồ sơ.') || lower.includes('lưu: vt, cbpttt.') || lower.includes('lưu: vt.')) {
    issues.push({
      id: 'err-thethuc-muc-luu',
      category: 'the_thuc',
      severity: 'suggestion',
      title: 'Mục lưu văn bản chưa ghi số lượng bản lưu hoặc sai ký hiệu đơn vị',
      currentContent: 'Lưu: VT, hồ sơ. (hoặc ký hiệu chưa khớp số văn bản)',
      expectedContent: 'Lưu: VT, [Ký hiệu phòng/đơn vị soạn thảo] (02 bản).',
      legalBasis: 'Điểm d Khoản 9 Mục II Phần I Phụ lục I Nghị định số 30/2020/NĐ-CP',
      explanation:
        "Dòng lưu gồm chữ 'Lưu: VT', dấu phẩy, chữ viết tắt tên đơn vị soạn thảo và số lượng bản lưu (ví dụ: Lưu: VT, CLCB, 02 bản.).",
      location: 'Dòng cuối cùng của Nơi nhận',
    });
  }

  // 10. Dấu hiệu viện dẫn văn bản cần kiểm tra với nguồn chính thức; không tự kết luận hiệu lực
  if (
    lower.includes('thông tư số 51/2014') ||
    lower.includes('thông tư số 45/2014') ||
    lower.includes('thông tư số 32/2022') ||
    lower.includes('thông tư 51/2014') ||
    lower.includes('thông tư 45/2014')
  ) {
    issues.push({
      id: 'err-hieu-luc-van-ban',
      category: 'can_cu_phap_ly',
      severity: 'warning',
      title: 'Cần xác minh hiệu lực và phạm vi áp dụng của văn bản được viện dẫn',
      currentContent: 'Phát hiện số hiệu văn bản thuộc danh sách cần rà soát',
      expectedContent: 'Đối chiếu văn bản gốc, điều khoản hiệu lực, văn bản sửa đổi/thay thế và phạm vi áp dụng trên nguồn chính thức',
      legalBasis: 'Chưa xác minh tự động; cần đối chiếu cơ sở dữ liệu văn bản pháp luật chính thức',
      explanation:
        'Việc khớp từ khóa/số hiệu chỉ là dấu hiệu để rà soát, không đủ chứng minh văn bản đã hết hiệu lực hoặc đã được thay thế. Công chức cần kiểm tra văn bản gốc và tình trạng hiệu lực tại thời điểm áp dụng.',
      location: 'Phần Căn cứ ban hành',
    });
  }

  // 11. Dấu hiệu đề cập phân loại A/B/C cần đối chiếu với văn bản hiện hành
  if (
    lower.includes('xếp loại a') ||
    lower.includes('xếp loại b') ||
    lower.includes('xếp loại c') ||
    lower.includes('loại a,') ||
    lower.includes('loại b,')
  ) {
    issues.push({
      id: 'err-xeploai-tt17',
      category: 'chuyen_mon_attp',
      severity: 'warning',
      title: 'Cần xác minh căn cứ hiện hành về cách phân loại cơ sở',
      currentContent: 'Phát hiện nội dung có nhắc đến xếp loại A/B/C',
      expectedContent: 'Đối chiếu văn bản chính thức, điều khoản sửa đổi/bãi bỏ, ngày hiệu lực và phạm vi áp dụng đối với loại cơ sở cụ thể',
      legalBasis: 'Chưa xác minh tự động; cần kiểm tra văn bản chính thức hiện hành',
      explanation:
        'Từ khóa “xếp loại A/B/C” có thể xuất hiện trong trích dẫn, tài liệu lịch sử hoặc ngữ cảnh khác. Chỉ riêng sự xuất hiện của từ khóa không chứng minh nội dung trái quy định hiện hành; cần xác minh căn cứ và ngữ cảnh trước khi kết luận.',
      location: 'Phần Kết luận thẩm định / Nội dung thông báo',
    });
  }

  // 12. Dấu hiệu nhãn/TPCN cần kiểm tra trực tiếp trên nhãn và quy định hiện hành
  if (
    (lower.includes('thực phẩm bảo vệ sức khỏe') ||
      lower.includes('glucosamine') ||
      lower.includes('collagen') ||
      docType === 'nhan_hang_hoa') &&
    !lower.includes('không phải là thuốc') &&
    (lower.includes('viên') || lower.includes('bổ') || lower.includes('uống') || lower.includes('mg'))
  ) {
    issues.push({
      id: 'err-nhan-canh-bao-tpcn',
      category: 'nhan_quang_cao',
      severity: 'warning',
      title: 'Cần kiểm tra trực tiếp nhãn và yêu cầu ghi nhãn áp dụng',
      currentContent: 'Bộ quy tắc không tìm thấy cụm từ cảnh báo trong phần văn bản đã phân tích',
      expectedContent: 'Đối chiếu ảnh/toàn bộ nhãn, loại sản phẩm, nội dung bắt buộc và quy định hiện hành áp dụng cho sản phẩm cụ thể',
      legalBasis: 'Gợi ý căn cứ cần xác minh: Luật An toàn thực phẩm, Nghị định 15/2018/NĐ-CP và quy định ghi nhãn hiện hành',
      explanation:
        'Không tìm thấy cụm từ trong văn bản trích xuất chưa chứng minh nhãn thực tế thiếu cảnh báo; nội dung có thể nằm trong hình ảnh, phần chưa trích xuất hoặc không thuộc trường hợp áp dụng. Cần kiểm tra nhãn đầy đủ và căn cứ hiện hành trước khi kết luận.',
      location: 'Nội dung bắt buộc ghi nhãn',
    });
  }

  // 13. Dấu hiệu ngôn từ quảng cáo cần xem xét trong ngữ cảnh
  if (
    lower.includes('trị dứt điểm') ||
    lower.includes('chữa khỏi hoàn toàn') ||
    lower.includes('thay thế thuốc') ||
    lower.includes('đặc trị')
  ) {
    issues.push({
      id: 'err-quang-cao-tri-benh',
      category: 'nhan_quang_cao',
      severity: 'warning',
      title: 'Cần xem xét ngữ cảnh của cụm từ quảng cáo có nguy cơ gây hiểu nhầm',
      currentContent: 'Phát hiện cụm từ cần xem xét trong nội dung',
      expectedContent: 'Đọc đoạn văn đầy đủ để xác định chủ thể phát ngôn, phủ định, trích dẫn, cảnh báo hoặc nội dung đang bị phản bác',
      legalBasis: 'Cần đối chiếu quy định quảng cáo/ghi nhãn hiện hành và loại sản phẩm cụ thể',
      explanation:
        'Từ khóa có thể xuất hiện trong trích dẫn, câu phủ định, cảnh báo hoặc nội dung phản bác. Chỉ riêng sự xuất hiện của cụm từ không đủ chứng minh có hành vi quảng cáo vi phạm; cần xem xét ngữ cảnh và tài liệu nguồn.',
      location: 'Phần Công dụng / Tác dụng',
    });
  }

  // Do not calculate an arbitrary aggregate score: it has no validated legal or
  // statistical interpretation. Keep the legacy field temporarily for API compatibility.
  const overallScore = 0;
  // A heuristic score must never be converted into a legal pass/fail status.
  // Every automated result remains pending verification by a competent human.
  const status = 'CAN_XAC_MINH';

  // Safety: do not silently rewrite legal/administrative documents using broad regex substitutions.
  // Preserve the original text until proposed edits can be reviewed individually by a human.
  const fixedDoc = content;

  const nowStr = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    overallScore,
    status,
    documentTypeDetected,
    summary:
      issues.length === 0
        ? 'Bộ quy tắc kiểm tra cục bộ chưa phát hiện dấu hiệu thuộc các mẫu kiểm tra đã lập trình. Điều này không chứng minh văn bản tuân thủ đầy đủ pháp luật hoặc không có sai sót.'
        : `Bộ quy tắc kiểm tra cục bộ ghi nhận ${issues.length} dấu hiệu cần rà soát (${issues.filter((i) => i.severity === 'error').length} dấu hiệu mức cao, ${issues.filter((i) => i.severity === 'warning').length} cảnh báo). Mỗi dấu hiệu cần được đối chiếu với văn bản gốc và quy định hiện hành trước khi kết luận.`,
    positivePoints: [
      'Đây là kết quả rà soát tự động theo các mẫu quy tắc đã lập trình, không phải xác nhận tuân thủ pháp luật.',
      'Hệ thống chưa tự xác minh hiệu lực, phạm vi áp dụng hoặc sửa đổi mới nhất của mọi căn cứ pháp lý được nêu.',
      'Công chức cần kiểm tra hồ sơ gốc, căn cứ pháp lý và bản dự thảo chỉnh sửa trước khi sử dụng.',
    ],
    issues,
    categoryScores: {
      the_thuc: {
        name: 'Thể thức văn bản (Nghị định 30/2020)',
        totalIssues: issues.filter((i) => i.category === 'the_thuc').length,
        severityBreakdown: {
          error: issues.filter((i) => i.category === 'the_thuc' && i.severity === 'error').length,
          warning: issues.filter((i) => i.category === 'the_thuc' && i.severity === 'warning').length,
          suggestion: issues.filter((i) => i.category === 'the_thuc' && i.severity === 'suggestion').length,
        },
      },
      can_cu_phap_ly: {
        name: 'Căn cứ pháp lý & Hiệu lực',
        totalIssues: issues.filter((i) => i.category === 'can_cu_phap_ly').length,
        severityBreakdown: {
          error: issues.filter((i) => i.category === 'can_cu_phap_ly' && i.severity === 'error').length,
          warning: issues.filter((i) => i.category === 'can_cu_phap_ly' && i.severity === 'warning').length,
          suggestion: issues.filter((i) => i.category === 'can_cu_phap_ly' && i.severity === 'suggestion').length,
        },
      },
      chuyen_mon_attp: {
        name: 'Chuyên môn ATTP & Quy trình',
        totalIssues: issues.filter((i) => i.category === 'chuyen_mon_attp').length,
        severityBreakdown: {
          error: issues.filter((i) => i.category === 'chuyen_mon_attp' && i.severity === 'error').length,
          warning: issues.filter((i) => i.category === 'chuyen_mon_attp' && i.severity === 'warning').length,
          suggestion: issues.filter((i) => i.category === 'chuyen_mon_attp' && i.severity === 'suggestion').length,
        },
      },
      nhan_quang_cao: {
        name: 'Nhãn hàng hóa & Quảng cáo',
        totalIssues: issues.filter((i) => i.category === 'nhan_quang_cao').length,
        severityBreakdown: {
          error: issues.filter((i) => i.category === 'nhan_quang_cao' && i.severity === 'error').length,
          warning: issues.filter((i) => i.category === 'nhan_quang_cao' && i.severity === 'warning').length,
          suggestion: issues.filter((i) => i.category === 'nhan_quang_cao' && i.severity === 'suggestion').length,
        },
      },
      dia_gioi_hanh_chinh: {
        name: 'Địa giới hành chính (NQ 202/2025)',
        totalIssues: issues.filter((i) => i.category === 'dia_gioi_hanh_chinh').length,
        severityBreakdown: {
          error: issues.filter((i) => i.category === 'dia_gioi_hanh_chinh' && i.severity === 'error').length,
          warning: issues.filter((i) => i.category === 'dia_gioi_hanh_chinh' && i.severity === 'warning').length,
          suggestion: issues.filter((i) => i.category === 'dia_gioi_hanh_chinh' && i.severity === 'suggestion').length,
        },
      },
    },
    fixedDocument: fixedDoc,
    auditDate: nowStr,
    documentTitle: fileName || documentTypeDetected,
  };
}
