import moment from 'moment/moment';
export default {
    report: (...args) => {
        if (import.meta.env.VITE_VUE_APP_DEBUG) {
            const title = args.shift();
            console.log(title);
            if (args.length) {
                console.log(...args);
            }
        }
    },
    download: (data, fileName, dataType) => {
        const blob = new Blob([data], { type: dataType });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(link.href);
    },
    time: {
        now: () => {
            return Math.floor(new Date().getTime() / 1000);
        },
        unixToDate: (unix) => {
            return new Date(unix * 1000);
        },
        dateFormat: (date) => {
            return date.toLocaleString();
        },
    },
    fromStringDateToDate: (stringDate) => {
        return moment(stringDate, 'YYYY-MM-DD HH:mm:ss').toDate();
    },
    formatCurrency: (value) => {
        return new Intl.NumberFormat('it-IT', {style: 'currency', currency: 'EUR' }).format(value);
    },
    formatNumber: (value) => {
        return new Intl.NumberFormat('it-IT', {style: 'decimal' }).format(value);
    },
    formatShort: (number,decPlaces) => {
        decPlaces = Math.pow(10, decPlaces)
        // Enumerate number abbreviations
        var abbrev = ['k', 'm', 'b', 't']

        // Go through the array backwards, so we do the largest first
        for (var i = abbrev.length - 1; i >= 0; i--) {
            // Convert array index to "1000", "1000000", etc
            var size = Math.pow(10, (i + 1) * 3)

            // If the number is bigger or equal do the abbreviation
            if (size <= number) {
                // Here, we multiply by decPlaces, round, and then divide by decPlaces.
                // This gives us nice rounding to a particular decimal place.
                number = Math.round((number * decPlaces) / size) / decPlaces

                // Handle special case where we round up to the next abbreviation
                if (number == 1000 && i < abbrev.length - 1) {
                    number = 1
                    i++
                }

                // Add the letter for the abbreviation
                number += abbrev[i]

                // We are done... stop
                break
            }
        }

        return number
    }
};
