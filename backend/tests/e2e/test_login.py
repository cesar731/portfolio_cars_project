import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

@pytest.fixture(scope="function")
def driver():
    driver = webdriver.Firefox()
    yield driver
    driver.quit()

def test_login_exitoso(driver):
    driver.get("http://localhost:5173/login")
    wait = WebDriverWait(driver, 10)

    wait.until(EC.presence_of_element_located((By.XPATH, '//input[@type="email"]')))

    driver.find_element(By.XPATH, '//input[@type="email"]').send_keys("iache@user.com")
    driver.find_element(By.XPATH, '//input[@type="password"]').send_keys("iache23")
    driver.find_element(By.XPATH, '//button[@type="submit"]').click()
    try:
        wait.until(EC.presence_of_element_located((By.XPATH, "//div[contains(text(), 'Mi cuenta')]")))
    except TimeoutException:
        try:
            wait.until(EC.presence_of_element_located((By.XPATH, "//a[contains(@href, '/profile')]")))
        except TimeoutException:
            if driver.find_elements(By.XPATH, '//input[@type="email"]'):
                pytest.fail("Login falló: el formulario de login sigue visible. El usuario no fue redirigido.")
            else:
                pytest.fail("Login falló: no se detectó ningún indicador de sesión iniciada.")

    assert "login" not in driver.current_url

def test_login_fallido_credenciales_invalidas(driver):
    driver.get("http://localhost:5173/login")
    wait = WebDriverWait(driver, 10)
    wait.until(EC.presence_of_element_located((By.XPATH, '//input[@type="email"]')))

    driver.find_element(By.XPATH, '//input[@type="email"]').send_keys("noexiste@user.com")
    driver.find_element(By.XPATH, '//input[@type="password"]').send_keys("malpass")
    driver.find_element(By.XPATH, '//button[@type="submit"]').click()

    error_msg = wait.until(
        EC.presence_of_element_located((By.XPATH, "//div[contains(text(), 'Credenciales inválidas')]"))
    )
    assert "Credenciales inválidas" in error_msg.text

def test_login_bloqueo_por_intentos(driver):
    driver.get("http://localhost:5173/login")
    wait = WebDriverWait(driver, 10)
    wait.until(EC.presence_of_element_located((By.XPATH, '//input[@type="email"]')))

    for _ in range(5):
        email = driver.find_element(By.XPATH, '//input[@type="email"]')
        password = driver.find_element(By.XPATH, '//input[@type="password"]')
        submit = driver.find_element(By.XPATH, '//button[@type="submit"]')
        
        email.clear()
        email.send_keys("iache@user.com")
        password.clear()
        password.send_keys("iache123")
        submit.click()
        
        wait.until(EC.presence_of_element_located((By.XPATH, '//input[@type="email"]')))
    
    lock_msg = wait.until(
        EC.presence_of_element_located((By.XPATH, "//div[contains(text(), 'Demasiados intentos fallidos')]"))
    )
    assert "Demasiados intentos fallidos" in lock_msg.text