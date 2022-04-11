const userData = [{date: "2022-04-13", type: "0"}, {date: "2022-04-12", type: "0"}, {date: "2022-04-10", type: "0"}];

function calendarInit() {
  const go_prev = document.querySelector('.go-prev');
  const go_next = document.querySelector('.go-next');


  const date = new Date(); // 현재 날짜(로컬 기준) 가져오기
  const utc = date.getTime() + (date.getTimezoneOffset() * 60 * 1000); // utc 표준시 도출
  const kstGap = 9 * 60 * 60 * 1000; // 한국 kst 기준시간 더하기
  const today = new Date(utc + kstGap); // 한국 시간으로 date 객체 만들기(오늘)

  let thisMonth = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  let currentYear = thisMonth.getFullYear(); // 달력에서 표기하는 연
  let currentMonth = thisMonth.getMonth(); // 달력에서 표기하는 월
  let currentDate = thisMonth.getDate(); // 달력에서 표기하는 일

  renderCalender(thisMonth);

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

    const year_month = document.querySelector('.year-month');
    year_month.textContent = currentYear + '.' + (currentMonth + 1);

    const calendar = document.querySelector('.dates');
    calendar.innerHTML = '';

    // 지난달
    for (let i = prevDate - prevDay; i <= prevDate; i++) {
      calendar.innerHTML = calendar.innerHTML +
        '<div class="day prev disable" >' + i + '</div>';
    }
    // 이번달
    const leaveDayArray = userData.map((value) => {
      return new Date(value.date).getDate();
    });

    for (let i = 1; i <= nextDate; i++) {
      let pass = false;
      for (let j = 0; j < leaveDayArray.length; j++) {
        if (i === leaveDayArray[j]) {
          calendar.innerHTML = calendar.innerHTML +
            '<div class="day current leaveDay"' +
            'data-set=' +
            `${currentYear}-` +
            `${currentMonth < 9 ? `0${currentMonth+1}` : currentMonth + 1}-` +
            `${i}` +
            '>' +
            i +
            '</div>';
          pass = true;
        }
      }
      if (!pass) {
        calendar.innerHTML = calendar.innerHTML +
          '<div class="day current" >' + i + '</div>';
      }
    }

    // 다음달
    for (let i = 1; i <= (7 - nextDay - 1 === 7 ? 0 : 7 - nextDay - 1); i++) {
      calendar.innerHTML = calendar.innerHTML +
        '<div class="day next disable">' + i + '</div>';
    }

    // 오늘 날짜 표기
    if (today.getMonth() === currentMonth && today.getFullYear() === currentYear) {
      const todayDate = today.getDate();
      const currentMonthDate = document.querySelectorAll('.dates .current');
      currentMonthDate[todayDate - 1].classList.add('today');
    }

  }

  // 이전달로 이동
  go_prev.addEventListener('click', () => {
    thisMonth = new Date(currentYear, currentMonth - 1, 1);
    renderCalender(thisMonth);
  });

  // 다음달로 이동
  go_next.addEventListener('click', () => {
    thisMonth = new Date(currentYear, currentMonth + 1, 1);
    renderCalender(thisMonth);
  });
}

calendarInit();

const leaveDays = document.querySelectorAll('.current.leaveDay');
const modal = document.getElementById('modal');
leaveDays.forEach((value, index) => {
  value.addEventListener('click', (e) => {
    console.log(e.target.dataset.set);
    // userData.forEach(value => console.log(value))
    modal.classList.toggle('show');
    const hi = userData.find(value => value.date === e.target.dataset.set)
    console.log(hi);
  });
});

modal.addEventListener("click", e => {
  const evTarget = e.target
  if(evTarget.classList.contains("show")) {
    console.log(evTarget);
    // modal.style.display = "none"
    modal.classList.toggle('show');
  }
})

document.querySelector('.modal-close').addEventListener('click', ()=> {
  modal.classList.toggle('show');
})


