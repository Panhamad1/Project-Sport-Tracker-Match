const CAMBODIA_TIMEZONE = "Asia/Phnom_Penh";
const CAMBODIA_UTC_OFFSET = "+07:00";
const CAMBODIA_OFFSET_MINUTES = 7 * 60;

const getCambodiaDateRange = (date) => {
    const startDate = new Date(`${date}T00:00:00.000${CAMBODIA_UTC_OFFSET}`);
    const endDate = new Date(`${date}T23:59:59.999${CAMBODIA_UTC_OFFSET}`);

    return { startDate, endDate };
};

const getCambodiaDateTimeFields = (date) => {
    const matchDate = new Date(date);

    if (Number.isNaN(matchDate.getTime())) {
        return {
            match_date_utc: date || null,
            match_date_local: null,
            match_time_local: null,
            match_datetime_local: null,
            timezone: CAMBODIA_TIMEZONE,
        };
    }

    const cambodiaDate = new Date(matchDate.getTime() + CAMBODIA_OFFSET_MINUTES * 60 * 1000);
    const cambodiaISOString = cambodiaDate.toISOString();
    const matchDateLocal = cambodiaISOString.slice(0, 10);
    const matchTimeLocal = cambodiaISOString.slice(11, 16);

    return {
        match_date_utc: matchDate.toISOString(),
        match_date_local: matchDateLocal,
        match_time_local: matchTimeLocal,
        match_datetime_local: `${matchDateLocal}T${matchTimeLocal}:00${CAMBODIA_UTC_OFFSET}`,
        timezone: CAMBODIA_TIMEZONE,
    };
};

export {
    CAMBODIA_TIMEZONE,
    getCambodiaDateRange,
    getCambodiaDateTimeFields,
};
