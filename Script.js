const { createApp } = Vue;

createApp({
    data() {
        return {
            startHour: '',
            startMinute: 0,
            startPeriod: 'AM',
            endHour: '',
            endMinute: 0,
            endPeriod: 'PM',
            result: '',
            isError: false
        };
    },
    methods: {
        calculateTime() {
            // 驗證輸入
            if (!this.startHour || !this.endHour) {
                this.showError('請輸入完整的開始和結束時間');
                return;
            }

            if (this.startHour < 1 || this.startHour > 12 || 
                this.endHour < 1 || this.endHour > 12) {
                this.showError('小時必須在 1-12 之間');
                return;
            }

            if (this.startMinute < 0 || this.startMinute > 59 || 
                this.endMinute < 0 || this.endMinute > 59) {
                this.showError('分鐘必須在 0-59 之間');
                return;
            }

            // 轉換為24小時制
            let startHour24 = this.convertTo24Hour(this.startHour, this.startPeriod);
            let endHour24 = this.convertTo24Hour(this.endHour, this.endPeriod);

            // 建立時間物件
            let startTime = new Date();
            startTime.setHours(startHour24, this.startMinute, 0, 0);

            let endTime = new Date();
            endTime.setHours(endHour24, this.endMinute, 0, 0);

            // 如果結束時間小於開始時間，表示跨日
            if (endTime < startTime) {
                endTime.setDate(endTime.getDate() + 1);
            }

            // 計算時間差（毫秒）
            let timeDiff = endTime - startTime;
            
            // 轉換為小時和分鐘
            let hours = Math.floor(timeDiff / (1000 * 60 * 60));
            let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

            this.showResult(`總時數：${hours} 小時 ${minutes} 分鐘`);
        },

        convertTo24Hour(hour, period) {
            if (period === 'AM') {
                return hour === 12 ? 0 : hour;
            } else {
                return hour === 12 ? 12 : hour + 12;
            }
        },

        showResult(message) {
            this.result = message;
            this.isError = false;
        },

        showError(message) {
            this.result = message;
            this.isError = true;
        }
    }
}).mount('#app');