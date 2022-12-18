// Return whether the year of the date instance is a leap year.
Date.prototype.isLeapYear = function() {
    var year = this.getFullYear();
    if((year & 3) != 0) return false;
    return ((year % 100) != 0 || (year % 400) == 0);
};

// Find the day of the current year of the given date instance.
Date.prototype.getDayOfYear = function() {
    var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    var mn = this.getMonth();
    var dn = this.getDate();
    var dayOfYear = dayCount[mn] + dn;
    if(mn > 1 && this.isLeapYear()) dayOfYear++;
    return dayOfYear;
};

// Find the week number in the current year of the given date instance.
Date.prototype.getWeekOfYear = function() {
    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    const startDayNum = yearStart.getUTCDay() || 7;
    yearStart.setUTCDate(yearStart.getUTCDate() - startDayNum + 1);
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
};

// Returns a moving average for an array with a given maximum distance in either direction.
getArrayMovingAverage = function(array, maxDistance) {
    let result = [];
    for (let i = 0; i < array.length; i++) {
        const slice = array.slice(Math.max(i - maxDistance, 0), Math.min(i + maxDistance, array.length));
        result.push(slice.reduce((acc, el) => acc + el, 0) / slice.length);
    }
    return result;
}
