 

export default {
  data() {
    return {
      disabled: false,
      text: this.$t('验证码')
    };
  },
  methods: {
    sendCode() {
      if (this.disabled) return;
      this.disabled = true;
      let n = 60;
      this.text = this.$t('剩余') + n + "s";
      const run = setInterval(() => {
        n = n - 1;
        if (n < 0) {
          clearInterval(run);
        }
        this.text = this.$t('剩余') + n + "s";
        if (this.text < this.$t('剩余') + 0 + "s") {
          this.disabled = false;
          this.text = this.$t('重新获取');
        }
      }, 1000);
    }
  }
};