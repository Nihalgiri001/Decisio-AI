from __future__ import annotations

import os
import sys
import unittest
from unittest.mock import MagicMock, patch

# Ensure backend is on path when running tests from repo root or backend/
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from llm_client import GroqClient


class TestGroqClient(unittest.TestCase):
    @patch("llm_client.openai")
    def test_initialization_with_api_key(self, mock_openai):
        # When api_key is passed, it should instantiate OpenAI client
        client = GroqClient(api_key="test-api-key")
        self.assertEqual(client.provider_name, "groq")
        self.assertEqual(client.model, "llama-3.3-70b-versatile")
        mock_openai.OpenAI.assert_called_once_with(
            api_key="test-api-key",
            base_url="https://api.groq.com/openai/v1"
        )

    def test_initialization_without_api_key(self):
        # When api_key is None (and GROQ_API_KEY env is unset), client should be None
        if "GROQ_API_KEY" in os.environ:
            del os.environ["GROQ_API_KEY"]
        client = GroqClient(api_key=None)
        self.assertIsNone(client.client)
        
        # Health check should return False
        hc = client.health_check()
        self.assertFalse(hc["ok"])
        self.assertEqual(hc["error"], "GROQ_API_KEY is not set")

    @patch("llm_client.openai")
    def test_health_check_success(self, mock_openai):
        mock_client = MagicMock()
        mock_openai.OpenAI.return_value = mock_client
        
        # Mock models.list()
        mock_model = MagicMock()
        mock_model.id = "llama-3.3-70b-versatile"
        mock_client.models.list.return_value.data = [mock_model]
        
        client = GroqClient(api_key="test-api-key")
        hc = client.health_check()
        
        self.assertTrue(hc["ok"])
        self.assertTrue(hc["model_available"])
        self.assertEqual(hc["model"], "llama-3.3-70b-versatile")
        self.assertIn("llama-3.3-70b-versatile", hc["models"])

    @patch("llm_client.openai")
    def test_health_check_failure(self, mock_openai):
        mock_client = MagicMock()
        mock_openai.OpenAI.return_value = mock_client
        mock_client.models.list.side_effect = Exception("API Connection Timeout")
        
        client = GroqClient(api_key="test-api-key")
        hc = client.health_check()
        
        self.assertFalse(hc["ok"])
        self.assertFalse(hc["model_available"])
        self.assertIn("API Connection Timeout", hc["error"])

    @patch("llm_client.openai")
    def test_generate_text_success(self, mock_openai):
        mock_client = MagicMock()
        mock_openai.OpenAI.return_value = mock_client
        
        mock_choice = MagicMock()
        mock_choice.message.content = "   This is a generated test output.   "
        mock_client.chat.completions.create.return_value.choices = [mock_choice]
        
        client = GroqClient(api_key="test-api-key")
        res = client.generate("test prompt", temperature=0.7)
        
        self.assertEqual(res, "This is a generated test output.")
        mock_client.chat.completions.create.assert_called_once_with(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": "test prompt"}],
            temperature=0.7
        )

    @patch("llm_client.openai")
    def test_generate_structured_json_success(self, mock_openai):
        mock_client = MagicMock()
        mock_openai.OpenAI.return_value = mock_client
        
        mock_choice = MagicMock()
        mock_choice.message.content = '{"opportunities": ["opp1"], "risks": ["risk1"], "missing_information": []}'
        mock_client.chat.completions.create.return_value.choices = [mock_choice]
        
        client = GroqClient(api_key="test-api-key")
        res = client.structured_generate("system", "user")
        
        self.assertIsInstance(res, dict)
        self.assertEqual(res["opportunities"], ["opp1"])
        self.assertEqual(res["risks"], ["risk1"])
        mock_client.chat.completions.create.assert_called_once_with(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "system"},
                {"role": "user", "content": "user"}
            ],
            response_format={"type": "json_object"},
            temperature=0.2
        )


if __name__ == "__main__":
    unittest.main()
