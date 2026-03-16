<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Sitemap — Hasan Smadi</title>
        <style>
          * { box-sizing: border-box; }
          body {
            font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background: #f8fafc;
            margin: 0;
            padding: 2rem;
            max-width: 56rem;
            margin-left: auto;
            margin-right: auto;
          }
          h1 {
            font-size: 1.75rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #0f172a;
          }
          .meta {
            color: #64748b;
            font-size: 0.875rem;
            margin-bottom: 2rem;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 0.5rem;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.08);
          }
          th, td {
            padding: 0.75rem 1rem;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
          }
          th {
            background: #f1f5f9;
            font-weight: 600;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #475569;
          }
          tr:hover td { background: #f8fafc; }
          a {
            color: #2563eb;
            text-decoration: none;
          }
          a:hover { text-decoration: underline; }
          .badge {
            display: inline-block;
            padding: 0.2rem 0.5rem;
            font-size: 0.7rem;
            border-radius: 0.25rem;
            font-weight: 500;
          }
          .badge { background: #e2e8f0; color: #475569; }
          .badge-weekly { background: #dcfce7; color: #166534; }
          .badge-monthly { background: #dbeafe; color: #1e40af; }
          .badge-yearly { background: #fef3c7; color: #92400e; }
          .badge-daily { background: #e0e7ff; color: #3730a3; }
        </style>
      </head>
      <body>
        <h1>Sitemap</h1>
        <p class="meta">
          <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs · Hasan Smadi
        </p>
        <table>
          <thead>
            <tr>
              <th>URL</th>
              <th>Last modified</th>
              <th>Frequency</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="sitemap:urlset/sitemap:url">
              <tr>
                <td>
                  <a href="{sitemap:loc}">
                    <xsl:value-of select="sitemap:loc"/>
                  </a>
                </td>
                <td>
                  <xsl:value-of select="sitemap:lastmod"/>
                </td>
                <td>
                  <span class="badge badge-{sitemap:changefreq}">
                    <xsl:value-of select="sitemap:changefreq"/>
                  </span>
                </td>
                <td>
                  <xsl:value-of select="sitemap:priority"/>
                </td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
