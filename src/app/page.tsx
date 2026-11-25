export default function HomePage() {
  return (
    <main>
      <p className="eyebrow">NBREAD V2</p>
      <h1>정산 확인을 더 가볍게</h1>
      <p className="lead">
        금융 앱의 입금 알림을 안전하게 받아 반복 납부를 확인해요. 확실하지 않은 거래는
        자동으로 처리하지 않고 직접 확인할 수 있게 해요.
      </p>
      <section className="card" aria-labelledby="setup-title">
        <h2 id="setup-title">초기 개발 흐름</h2>
        <ol>
          <li>허용한 금융 앱의 새 알림을 받아요.</li>
          <li>서버에서 형식과 중복 여부를 확인해요.</li>
          <li>검증된 거래만 정산 후보와 연결해요.</li>
        </ol>
      </section>
    </main>
  );
}
