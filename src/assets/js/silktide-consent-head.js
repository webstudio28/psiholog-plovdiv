silktideCookieBannerManager.updateCookieBannerConfig({
    background: {
        showBackground: true
    },
    cookieIcon: {
        position: "bottomLeft"
    },
    cookieTypes: [
        {
            id: "",
            name: "Задължителни",
            description: "<p>Тези бисквитки са необходими за правилното функциониране на уебсайта и не могат да бъдат изключени. Те помагат при действия като влизане в акаунт и настройване на предпочитанията за поверителност.</p>",
            required: true,
            onAccept: function () {
                // console.log('Add logic for the required Задължителни here');
            }
        },
        {
            id: "",
            name: "Аналитични",
            description: "<p>Тези бисквитки ни помагат да подобрим сайта, като проследяват кои страници са най-популярни и как посетителите се придвижват в него.</p>",
            required: false,
        }
    ],
    text: {
        banner: {
            description: "<p>Ние използваме бисквитки на нашия сайт, за да подобрим вашето потребителско изживяване, да предоставим персонализирано съдържание и да анализираме трафика си. <a href=\"https://www.psiholog-plovdiv.com/policy.html\" target=\"_blank\">Политика</a></p>",
            acceptAllButtonText: "Приеми всички",
            acceptAllButtonAccessibleLabel: "Accept all cookies",
            rejectNonEssentialButtonText: "Отхвърли незадължителни.",
            rejectNonEssentialButtonAccessibleLabel: "Reject non-essential",
            preferencesButtonText: "Преференции",
            preferencesButtonAccessibleLabel: "Toggle preferences"
        },
        preferences: {
            title: "Персонализирай",
            description: "<p>Ние зачитаме правото ви на поверителност. Можете да откажете някои видове бисквитки. Вашите предпочитания ще важат за целия ни уебсайт.</p>",
            creditLinkText: "Get this banner for free",
            creditLinkAccessibleLabel: "Get this banner for free"
        }
    },
    position: {
        banner: "bottomCenter"
    }
});