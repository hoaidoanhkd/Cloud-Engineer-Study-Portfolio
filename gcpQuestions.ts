interface GCPQuestion {
  questionNumber: number;
  correctAnswer: string;
  shortExplanation: string;
}

export const gcpQuestionsSummary: GCPQuestion[] = [
  {
    questionNumber: 295,
    correctAnswer: "B – Set up Cloud Monitoring alerts on the data freshness metric for the Dataflow jobs to receive a notification when a certain threshold is reached.",
    shortExplanation: "Dataflow cung cấp metric về độ 'freshness' (độ trễ dữ liệu). Cách tốt nhất để phát hiện job bị 'stuck' là đặt Cloud Monitoring alert trên metric này thay vì tự xây dựng giải pháp phức tạp."
  },
  {
    questionNumber: 297,
    correctAnswer: "B – Attach a custom service account to the instance, and grant the service account the BigQuery Data Viewer IAM role on the dataset.",
    shortExplanation: "GCP khuyến nghị dùng Service Account thay vì credentials tạm thời tự tạo. Gắn Service Account vào VM và chỉ cấp quyền mức dataset, giảm thiểu quyền và chi phí quản lý."
  },
  {
    questionNumber: 300,
    correctAnswer: "C – Ingest your application logs to Cloud Logging by using Ops Agent, and explore your logs with Log Analytics.",
    shortExplanation: "Log Analytics (tích hợp trong Cloud Logging) cho phép phân tích logs bằng SQL và vẽ biểu đồ, không cần thêm BigQuery hoặc Cloud SQL → tiết kiệm chi phí và quản lý dễ dàng."
  },
  {
    questionNumber: 301,
    correctAnswer: "B – Create the GKE cluster with Workload Identity Federation. Create a Google service account and a Kubernetes ServiceAccount, and configure both service accounts to use Workload Identity Federation.",
    shortExplanation: "Workload Identity Federation là phương pháp an toàn, không dùng key file, cho phép Pod nhận danh tính Google Service Account qua Kubernetes ServiceAccount."
  },
  {
    questionNumber: 303,
    correctAnswer: "B – Grant the team the two predefined IAM roles.",
    shortExplanation: "Best practice là dùng predefined roles thay vì custom, trừ khi không đáp ứng yêu cầu. Ở đây có sẵn 2 role cần thiết → cấp trực tiếp cả hai."
  },
  {
    questionNumber: 305,
    correctAnswer: "D – Deploy your code to Cloud Run. Use Eventarc for event delivery.",
    shortExplanation: "Cloud Run + Eventarc = serverless, chỉ trả phí khi chạy, nhận event từ Google Services, truy cập public internet, chuẩn best practice và tiết kiệm chi phí."
  },
  {
    questionNumber: 311,
    correctAnswer: "A – Migrate your data to AlloyDB.",
    shortExplanation: "AlloyDB là dịch vụ PostgreSQL tương thích cao, tối ưu hiệu năng hơn Cloud SQL, ít thay đổi schema/code, hỗ trợ khối lượng dữ liệu lớn hơn 150 TB/region."
  },
  {
    questionNumber: 312,
    correctAnswer: "D – Use Google Kubernetes Engine (GKE) and hardware accelerators as a platform to run the fine-tuning jobs.",
    shortExplanation: "GKE + GPU/TPU là nền tảng linh hoạt, mở rộng tốt, phù hợp cho ML fine-tuning khối lượng dữ liệu lớn hơn các dịch vụ khác."
  },
  {
    questionNumber: 317,
    correctAnswer: "D – Create a host VPC project with each production project as its service project. Apply hierarchical firewall policies on the organization level.",
    shortExplanation: "Mô hình Shared VPC (host + service projects) là best practice cho landing zone. Hierarchical firewall policies giúp kiểm soát truy cập TCP ports toàn tổ chức, giảm quản lý thủ công."
  }
];

// Helper function to get question by number
export function getQuestionByNumber(questionNumber: number): GCPQuestion | undefined {
  return gcpQuestionsSummary.find(q => q.questionNumber === questionNumber);
}

// Helper function to get all question numbers
export function getAllQuestionNumbers(): number[] {
  return gcpQuestionsSummary.map(q => q.questionNumber);
}

// Display formatted summary
export function displaySummary(): void {
  console.log("=".repeat(80));
  console.log("TỔNG HỢP CÂU HỎI GCP - BEST PRACTICES");
  console.log("=".repeat(80));
  
  gcpQuestionsSummary.forEach(question => {
    console.log(`\n❓ Câu ${question.questionNumber}:`);
    console.log(`✅ Đáp án: ${question.correctAnswer}`);
    console.log(`💡 Giải thích: ${question.shortExplanation}`);
    console.log("-".repeat(80));
  });
}