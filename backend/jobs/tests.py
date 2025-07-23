from django.test import TestCase

class SimpleMathTest(TestCase):
    def test_addition(self):
        self.assertEqual(1 + 1, 2)
    def test_subtraction(self):
        self.assertEqual(5 - 3, 2)
    def test_multiplication(self):
        self.assertEqual(2 * 3, 6)
    def test_division(self):
        self.assertEqual(10 / 2, 5)
    def test_string_concatenation(self):
        self.assertEqual("Hello " + "World", "Hello World")
    def test_list_contains(self):
        self.assertIn(3, [1, 2, 3, 4])
    def test_true_boolean(self):
        self.assertTrue(5 > 3)
    def test_list_length(self):
        self.assertEqual(len([1, 2, 3]), 3)







