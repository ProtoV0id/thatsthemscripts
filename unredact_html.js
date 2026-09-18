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
        if (!value) return "";

        return value
            .replaceAll("-", " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function unique(items) {
        return [...new Set(items.filter(Boolean))];
    }

    function escapeHTML(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;");
    }

    function makeList(items, type = "") {
        if (!items.length) {
            return '<div class="empty">None listed</div>';
        }

        return `
            <ul>
                ${items.map(item => {
                    const safe = escapeHTML(item);

                    if (type === "phone") {
                        const tel = item.replace(/[^\d+]/g, "");

                        return `
                            <li>
                                <a href="tel:${tel}">
                                    ${safe}
                                </a>
                            </li>
                        `;
                    }

                    if (type === "email") {
                        return `
                            <li>
                                <a href="mailto:${safe}">
                                    ${safe}
                                </a>
                            </li>
                        `;
                    }

                    return `<li>${safe}</li>`;
                }).join("")}
            </ul>
        `;
    }

    const people = [];

    document.querySelectorAll(".record").forEach(record => {
        const person = {
            name: null,
            phones: [],
            emails: [],
            addresses: [],
            aliases: []
        };

        const heading = record.querySelector("h2");

        if (heading) {
            person.name = heading.innerText.trim();
        }

        record.querySelectorAll("[x-href]").forEach(el => {
            const encoded = el.getAttribute("x-href");
            const decoded = decodeXHref(encoded);

            if (!decoded) return;

            const value = cleanDecoded(decoded);

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
                const cleaned = value
                    .replaceAll("-", " ")
                    .trim();

                if (!person.name) {
                    person.name = cleaned;
                } else if (
                    cleaned.toLowerCase() !==
                    person.name.toLowerCase()
                ) {
                    person.aliases.push(cleaned);
                }
            }
        });

        person.phones = unique(person.phones);
        person.emails = unique(person.emails);
        person.addresses = unique(person.addresses);
        person.aliases = unique(person.aliases);

        if (
            person.name ||
            person.phones.length ||
            person.emails.length ||
            person.addresses.length
        ) {
            people.push(person);
        }
    });

    let cards = "";

    people.forEach((person, index) => {
        const name = escapeHTML(
            person.name || `Unknown Person ${index + 1}`
        );

        const initial =
            name.charAt(0).toUpperCase();

        cards += `
            <section class="card">

                <div class="card-header">

                    <div class="avatar">
                        ${initial}
                    </div>

                    <div>
                        <h2>${name}</h2>

                        <div class="record-label">
                            Person Record
                        </div>
                    </div>

                </div>

                <div class="grid">

                    <div class="section">

                        <h3>Phone Numbers</h3>

                        ${makeList(
                            person.phones,
                            "phone"
                        )}

                    </div>

                    <div class="section">

                        <h3>Email Addresses</h3>

                        ${makeList(
                            person.emails,
                            "email"
                        )}

                    </div>

                </div>

                <div class="section">

                    <h3>Addresses</h3>

                    ${makeList(
                        person.addresses
                    )}

                </div>

                <div class="section">

                    <h3>Other Names</h3>

                    ${makeList(
                        person.aliases
                    )}

                </div>

            </section>
        `;
    });

    const report = `
<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1"
>

<title>People Search Report</title>

<style>

* {
    box-sizing: border-box;
}

body {
    margin: 0;
    background: #f4f4f5;
    color: #18181b;

    font-family:
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Arial,
        sans-serif;
}

header {
    background: #18181b;
    color: white;

    padding: 28px 24px;
}

.header-inner {
    max-width: 960px;
    margin: auto;
}

header h1 {
    margin: 0;
    font-size: 28px;
}

header p {
    margin: 6px 0 0;
    color: #d4d4d8;
}

main {
    max-width: 960px;

    margin: auto;
    padding: 28px 20px 60px;
}

.summary {
    background: white;

    border: 1px solid #e4e4e7;
    border-radius: 9px;

    padding: 15px 18px;
    margin-bottom: 20px;

    color: #52525b;
}

.card {
    margin-bottom: 24px;

    overflow: hidden;

    background: white;

    border: 1px solid #e4e4e7;
    border-left: 5px solid #27272a;

    border-radius: 10px;

    box-shadow:
        0 3px 12px
        rgba(0, 0, 0, 0.05);
}

.card-header {
    display: flex;
    align-items: center;

    gap: 15px;

    padding: 20px;

    background: #fafafa;

    border-bottom: 1px solid #e4e4e7;
}

.avatar {
    width: 52px;
    height: 52px;

    display: flex;
    align-items: center;
    justify-content: center;

    flex-shrink: 0;

    border-radius: 50%;

    background: #27272a;
    color: white;

    font-size: 22px;
    font-weight: bold;
}

.card-header h2 {
    margin: 0;

    font-size: 22px;
}

.record-label {
    margin-top: 3px;

    color: #71717a;

    font-size: 13px;
}

.grid {
    display: grid;

    grid-template-columns:
        repeat(
            2,
            minmax(0, 1fr)
        );
}

.grid .section:first-child {
    border-right: 1px solid #eeeeee;
}

.section {
    padding: 18px 20px;

    border-bottom: 1px solid #eeeeee;
}

.section:last-child {
    border-bottom: none;
}

.section h3 {
    margin: 0 0 10px;

    font-size: 12px;

    letter-spacing: 0.6px;
    text-transform: uppercase;

    color: #52525b;
}

ul {
    margin: 0;
    padding-left: 20px;
}

li {
    margin: 7px 0;
}

a {
    color: #2563eb;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

.empty {
    color: #a1a1aa;
    font-style: italic;
}

footer {
    margin-top: 35px;

    color: #71717a;

    text-align: center;
    font-size: 12px;
}

@media(max-width: 650px) {

    .grid {
        grid-template-columns: 1fr;
    }

    .grid .section:first-child {
        border-right: none;
    }

}

@media print {

    body {
        background: white;
    }

    header {
        background: white;
        color: black;

        border-bottom: 2px solid black;
    }

    header p {
        color: #555;
    }

    .card {
        break-inside: avoid;
        box-shadow: none;
    }

    a {
        color: black;
        text-decoration: none;
    }

}

</style>

</head>

<body>

<header>

    <div class="header-inner">

        <h1>
            People Search Report
        </h1>

        <p>
            Extracted and decoded browser results
        </p>

    </div>

</header>

<main>

    <div class="summary">

        <strong>
            ${people.length}
        </strong>

        record${people.length === 1 ? "" : "s"} extracted

    </div>

    ${cards}

    <footer>

        Generated
        ${new Date().toLocaleString()}

    </footer>

</main>

</body>

</html>
`;

    const blob = new Blob(
        [report],
        {
            type: "text/html;charset=utf-8"
        }
    );

    const downloadURL =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = downloadURL;
    link.download = "people_report.html";

    document.body.appendChild(link);

    link.click();

    link.remove();

    setTimeout(() => {
        URL.revokeObjectURL(downloadURL);
    }, 1000);

    console.log(
        `Downloaded people_report.html with ${people.length} record(s).`
    );
})();
