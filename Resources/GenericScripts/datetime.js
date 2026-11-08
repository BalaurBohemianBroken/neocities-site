class DateTime {
    static day_length = 24 * 60 * 60 * 1000;
    static days_str = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

    static YMDToDate(correct_date) {
        let d = new Date(correct_date.slice(0, 4), correct_date.slice(4, 6) - 1, correct_date.slice(6, 8));
        d.setUTCHours(0, 0, 0, 0);
        return d;
    };
}