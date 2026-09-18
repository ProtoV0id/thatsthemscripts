(() => {
    function decodeXHref(value) {
        if (!value) return null;

        try {
            return atob(value);
        } catch {
            return null;
        }
    }

    function cleanDecoded(value) {
        if (!value) return null;

        const prefixes = [
            "/phone/",
            "/email/",
            "/address/",
            "/name/"
        ];

        for (const prefix of prefixes) {
            if (value.startsWith(prefix)) {
                return value.slice(prefix.length);
            }
        }

        return value;
    }

    function formatAddress(value) {
        if (!value) return null;

        return value
            .replaceAll("-", " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function unique(items) {
        return [...new Set(items.filter(Boolean))];
    }

    const people = [];

    document.querySelectorAll(".record").forEach((record, index) => {
        const person = {
            name: null,
            phones: [],
            emails: [],
            addresses: [],
            aliases: []
        };

        const heading = record.querySelector("h2");

        if (heading) {
            person.name =
                heading.innerText.trim();
        }

        record.querySelectorAll("[x-href]").forEach(el => {
            const encoded =
                el.getAttribute("x-href");

            const decoded =
                decodeXHref(encoded);

            if (!decoded) return;

            const value =
                cleanDecoded(decoded);

            if (decoded.startsWith("/phone/")) {
                person.phones.push(value);
            }

            else if (decoded.startsWith("/email/")) {
                person.emails.push(value);
            }

            else if (decoded.startsWith("/address/")) {
                person.addresses.push(
                    formatAddress(value)
                );
            }

            else if (decoded.startsWith("/name/")) {
                const cleaned =
                    value
                        .replaceAll("-", " ")
                        .trim();

                if (!person.name) {
                    person.name = cleaned;
                }

                else if (
                    cleaned.toLowerCase() !==
                    person.name.toLowerCase()
                ) {
                    person.aliases.push(cleaned);
                }
            }
        });

        person.phones =
            unique(person.phones);

        person.emails =
            unique(person.emails);

        person.addresses =
            unique(person.addresses);

        person.aliases =
            unique(person.aliases);

        if (
            person.name ||
            person.phones.length ||
            person.emails.length ||
            person.addresses.length
        ) {
            people.push(person);
        }
    });

    const output = {
        source: window.location.href,
        generated_at: new Date().toISOString(),
        record_count: people.length,
        records: people
    };

    const json =
        JSON.stringify(
            output,
            null,
            2
        );

    const blob =
        new Blob(
            [json],
            {
                type: "application/json;charset=utf-8"
            }
        );

    const downloadURL =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href =
        downloadURL;

    link.download =
        "people_results.json";

    document.body.appendChild(
        link
    );

    link.click();

    link.remove();

    setTimeout(() => {
        URL.revokeObjectURL(
            downloadURL
        );
    }, 1000);

    console.log(
        `Downloaded people_results.json with ${people.length} record(s).`
    );
})();
