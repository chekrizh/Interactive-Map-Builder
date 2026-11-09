"""Run: python3 -m unittest discover tests"""
import json
import pathlib
import re
import sys
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'skill' / 'pretty-text' / 'scripts'))
import render  # noqa: E402


class RenderTest(unittest.TestCase):
    def test_text_that_looks_like_html_stays_inside_the_json_tag(self):
        content = {'title': '</script><script>alert(1)</script><!--', 'sections': [{'heading': 'h', 'points': ['<b>x</b>']}]}
        page = render.render('<body>' + render.PLACEHOLDER + '</body>', content)
        payload = re.search(r'id="page-content">(.*?)</script>', page).group(1)
        self.assertEqual(json.loads(payload), content)

    def test_shipped_template_has_exactly_one_empty_placeholder(self):
        self.assertEqual(render.TEMPLATE.read_text(encoding='utf-8').count(render.PLACEHOLDER), 1)

    def test_sample_content_is_valid_and_broken_content_is_reported(self):
        sample = json.loads((ROOT / 'app' / 'src' / 'content.json').read_text(encoding='utf-8'))
        self.assertEqual(render.problems(sample), [])
        self.assertEqual(render.problems({'title': ' ', 'sections': [{'heading': 'h', 'body': 'x'}]}), [
            'title must be a non-empty string',
            'sections[0]: unknown field body',
            'sections[0] needs paragraphs or points',
        ])


if __name__ == '__main__':
    unittest.main()
