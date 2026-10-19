import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { FormattedChatOutput } from './FormattedChatOutput'

describe('FormattedChatOutput', () => {
  it('pretty-prints JSON output', () => {
    const output = renderToStaticMarkup(
      <FormattedChatOutput content='{"answer":"Structured response"}' outputFormat="json" />,
    )

    expect(output).toContain('aria-label="JSON output"')
    expect(output).toContain('\n  &quot;answer&quot;: &quot;Structured response&quot;\n')
  })

  it('renders Markdown output with the existing Markdown renderer', () => {
    const heading = renderToStaticMarkup(<FormattedChatOutput content="# Heading" outputFormat="markdown" />)
    const emphasis = renderToStaticMarkup(<FormattedChatOutput content="**Important**" outputFormat="markdown" />)

    expect(heading).toContain('<h1>Heading</h1>')
    expect(emphasis).toContain('<strong>Important</strong>')
  })

  it('renders Table output with GFM table support', () => {
    const output = renderToStaticMarkup(
      <FormattedChatOutput content={'| Name | Score |\n| --- | --- |\n| Ada | 10 |'} outputFormat="table" />,
    )

    expect(output).toContain('<table>')
    expect(output).toContain('<th>Name</th>')
    expect(output).toContain('<td>10</td>')
  })

  it('preserves Email output line breaks', () => {
    const output = renderToStaticMarkup(
      <FormattedChatOutput content={'Subject: Update\n\nHello team,'} outputFormat="email" />,
    )

    expect(output).toContain('aria-label="Email output"')
    expect(output).toContain('Subject: Update\n\nHello team,')
  })

  it('displays HTML as escaped source instead of injecting it', () => {
    const output = renderToStaticMarkup(
      <FormattedChatOutput content="<h1>Untrusted output</h1>" outputFormat="html" />,
    )

    expect(output).toContain('aria-label="HTML output"')
    expect(output).toContain('&lt;h1&gt;Untrusted output&lt;/h1&gt;')
    expect(output).not.toContain('<h1>Untrusted output</h1>')
  })
})
