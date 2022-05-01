const userData = [{ date: '2022-04-13', type: '0' }, { date: '2022-04-12', type: '0' }, { date: '2022-04-10', type: '0' }];
const modalContent = document.querySelector('.modal-content');

function calendarInit() {
  const goPrev = document.querySelector('.go-prev');
  const goNext = document.querySelector('.go-next');

  const date = new Date(); // 현재 날짜(로컬 기준) 가져오기
  const utc = date.getTime() + (date.getTimezoneOffset() * 60 * 1000); // utc 표준시 도출
  const kstGap = 9 * 60 * 60 * 1000; // 한국 kst 기준시간 더하기
  const today = new Date(utc + kstGap); // 한국 시간으로 date 객체 만들기(오늘)

  let thisMonth = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  let currentYear = thisMonth.getFullYear(); // 달력에서 표기하는 연
  let currentMonth = thisMonth.getMonth(); // 달력에서 표기하는 월
  let currentDate = thisMonth.getDate(); // 달력에서 표기하는 일

  function renderCalender(thisMonth) {
    currentYear = thisMonth.getFullYear();
    currentMonth = thisMonth.getMonth();
    currentDate = thisMonth.getDate();

    // 이전 달의 마지막 날 날짜와 요일 구하기
    const startDay = new Date(currentYear, currentMonth, 0);
    const prevDate = startDay.getDate();
    const prevDay = startDay.getDay();

    const endDay = new Date(currentYear, currentMonth + 1, 0);
    const nextDate = endDay.getDate();
    const nextDay = endDay.getDay(); // 0 -> 일요일

    const yearMonth = document.querySelector('.year-month');
    yearMonth.textContent = `${currentYear}.${currentMonth + 1}`;

    const calendar = document.querySelector('.dates');
    calendar.innerHTML = '';

    // 지난달
    for (let i = prevDate - prevDay; i <= prevDate; i++) {
      calendar.innerHTML = `${calendar.innerHTML
      }<div class="day prev disable" >${i}</div>`;
    }
    // 이번달
    const leaveDayArray = userData.map((value) => new Date(value.date).getDate());

    for (let i = 1; i <= nextDate; i++) {
      let pass = false;
      for (let j = 0; j < leaveDayArray.length; j++) {
        if (i === leaveDayArray[j]) {
          calendar.innerHTML = `${calendar.innerHTML
          }<div class="day current leaveDay"`
            + 'data-set='
            + `${currentYear}-`
            + `${currentMonth < 9 ? `0${currentMonth + 1}` : currentMonth + 1}-`
            + `${i}`
            + `>${
              i
            }</div>`;
          pass = true;
        }
      }
      if (!pass) {
        calendar.innerHTML = `${calendar.innerHTML
        }<div class="day current" >${i}</div>`;
      }
    }

    // 다음달
    for (let i = 1; i <= (7 - nextDay - 1 === 7 ? 0 : 7 - nextDay - 1); i++) {
      calendar.innerHTML = `${calendar.innerHTML
      }<div class="day next disable">${i}</div>`;
    }

    // 오늘 날짜 표기
    if (today.getMonth() === currentMonth && today.getFullYear() === currentYear) {
      const todayDate = today.getDate();
      const currentMonthDate = document.querySelectorAll('.dates .current');
      currentMonthDate[todayDate - 1].classList.add('today');
    }
  }

  renderCalender(thisMonth);

  // 이전달로 이동
  goPrev.addEventListener('click', () => {
    thisMonth = new Date(currentYear, currentMonth - 1, 1);
    renderCalender(thisMonth);
  });

  // 다음달로 이동
  goNext.addEventListener('click', () => {
    thisMonth = new Date(currentYear, currentMonth + 1, 1);
    renderCalender(thisMonth);
  });
}

calendarInit();

const leaveDays = document.querySelectorAll('.current.leaveDay');
const modal = document.getElementById('modal');
leaveDays.forEach((value) => {
  value.addEventListener('click', (e) => {
    modal.classList.toggle('show');
    const leaveDay = userData.find((v) => v.date === e.target.dataset.set);
    modalContent.textContent = `${leaveDay.date} 타입은 ${leaveDay.type}`;
  });
});

modal.addEventListener('click', (e) => {
  const evTarget = e.target;
  if (evTarget.classList.contains('show')) {
    console.log(evTarget);
    // modal.style.display = "none"
    modal.classList.toggle('show');
  }
});

document.querySelector('.modal-close').addEventListener('click', () => {
  modal.classList.toggle('show');
});
