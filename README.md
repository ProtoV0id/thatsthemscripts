# thatsthemscripts
# ProtoVoid

Simple browser-console tools for extracting and saving decoded record information from supported result pages.

## HTML Download

The HTML version creates a clean, readable report from the records on the current webpage.

It can include:

- Names
- Phone numbers
- Email addresses
- Addresses
- Alternate names

### How to use

1. Open the result page in your browser.
2. Press `F12` to open Developer Tools.
3. Open the **Console** tab.
4. Paste the HTML download script.
5. Press `Enter`.
6. A file named `people_report.html` will download automatically.

Open the downloaded file in any web browser.

You can also save it as a PDF by pressing:

`Ctrl + P`

Then choose **Save to PDF**.

---

## JSON Download

The JSON version saves the extracted information as structured data instead of a visual report.

It creates:

`people_results.json`

Example:

```json
{
  "source": "https://example.com/example-page",
  "record_count": 1,
  "records": [
    {
      "name": "Example Person",
      "phones": [
        "555-555-1234"
      ],
      "emails": [
        "example@example.com"
      ],
      "addresses": [
        "123 Example St Example City AZ 85000"
      ],
      "aliases": []
    }
  ]
}
How to use
Open the result page in your browser.
Press F12.
Open the Console tab.
Paste the JSON download script.
Press Enter.
A file named people_results.json will download automatically.

The JSON file is useful for importing the extracted data into:

Python scripts
JavaScript tools
Databases
OSINT workflows
Other analysis tools
Notes

The scripts work with information already loaded in the browser and decode supported Base64 x-href values found in the page.

Run the script separately on each page you want to export.
