import sys
import json
import time
import argparse
from dataclasses import dataclass, field
from typing import Optional
import requests
from requests.exceptions import ConnectionError, Timeout


DEFAULT_URL     = "http://localhost:4000"
TIMEOUT_SECONDS = 15
MAX_RETRIES     = 3
RETRY_DELAY     = 5


@dataclass
class TestResult:
    name:     str
    passed:   bool
    status:   Optional[int] = None
    duration: Optional[float] = None
    error:    Optional[str] = None


@dataclass
class SmokeTestSuite:
    base_url: str
    results:  list[TestResult] = field(default_factory=list)
    token:    Optional[str] = None

    def add(self, result: TestResult):
        self.results.append(result)

    @property
    def passed(self) -> int:
        return sum(1 for r in self.results if r.passed)

    @property
    def failed(self) -> int:
        return sum(1 for r in self.results if not r.passed)

    @property
    def all_passed(self) -> bool:
        return self.failed == 0


def make_request(
    method: str,
    url: str,
    token: Optional[str] = None,
    json_body: Optional[dict] = None,
) -> tuple[Optional[requests.Response], Optional[str]]:
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = token

    try:
        response = requests.request(
            method=method,
            url=url,
            headers=headers,
            json=json_body,
            timeout=TIMEOUT_SECONDS,
        )
        return response, None
    except ConnectionError:
        return None, f"Nao foi possivel conectar em {url}"
    except Timeout:
        return None, f"Timeout apos {TIMEOUT_SECONDS}s em {url}"
    except Exception as e:
        return None, str(e)


def wait_for_api(base_url: str) -> bool:
    print(f"\n[INFO] Aguardando API em {base_url}/health...")

    for attempt in range(1, MAX_RETRIES + 1):
        response, error = make_request("GET", f"{base_url}/health")

        if response and response.status_code == 200:
            print(f"[OK] API disponivel apos {attempt} tentativa(s).")
            return True

        print(f"[AVISO] Tentativa {attempt}/{MAX_RETRIES} falhou. "
              f"Aguardando {RETRY_DELAY}s...")
        time.sleep(RETRY_DELAY)

    print("[ERRO] API nao ficou disponivel.")
    return False



def test_health(suite: SmokeTestSuite):
    start = time.time()
    response, error = make_request("GET", f"{suite.base_url}/health")
    duration = (time.time() - start) * 1000

    if error:
        suite.add(TestResult(
            name="GET /health",
            passed=False,
            error=error,
        ))
        return

    passed = response.status_code == 200

    if passed:
        try:
            body = response.json()
            db_ok = body.get("services", {}).get("database") == "ok"
            if not db_ok:
                suite.add(TestResult(
                    name="GET /health",
                    passed=False,
                    status=response.status_code,
                    duration=duration,
                    error="Banco de dados reportado como unreachable",
                ))
                return
        except Exception:
            pass

    suite.add(TestResult(
        name="GET /health",
        passed=passed,
        status=response.status_code,
        duration=duration,
        error=None if passed else f"Status inesperado: {response.status_code}",
    ))


def test_swagger(suite: SmokeTestSuite):
    start = time.time()
    response, error = make_request("GET", f"{suite.base_url}/swagger")
    duration = (time.time() - start) * 1000

    if error:
        suite.add(TestResult(name="GET /swagger", passed=False, error=error))
        return

    passed = response.status_code == 200
    suite.add(TestResult(
        name="GET /swagger",
        passed=passed,
        status=response.status_code,
        duration=duration,
        error=None if passed else f"Status inesperado: {response.status_code}",
    ))


def test_create_user(suite: SmokeTestSuite):
    payload = {
        "nome":    "Smoke Test User",
        "usuario": f"smoketest_{int(time.time())}@test.com",
        "senha":   "SmokeTest123",
        "foto":    "https://example.com/avatar.jpg",
    }

    start = time.time()
    response, error = make_request(
        "POST",
        f"{suite.base_url}/usuarios/cadastrar",
        json_body=payload,
    )
    duration = (time.time() - start) * 1000

    if error:
        suite.add(TestResult(
            name="POST /usuarios/cadastrar",
            passed=False,
            error=error,
        ))
        return

    passed = response.status_code in (200, 201)

    if passed:
        try:
            body = response.json()
            suite._test_user = payload
        except Exception:
            pass

    suite.add(TestResult(
        name="POST /usuarios/cadastrar",
        passed=passed,
        status=response.status_code,
        duration=duration,
        error=None if passed else f"Status inesperado: {response.status_code}",
    ))


def test_login(suite: SmokeTestSuite):
    test_user = getattr(suite, "_test_user", None)

    if not test_user:
        suite.add(TestResult(
            name="POST /usuarios/login",
            passed=False,
            error="Skipped — usuario de teste nao foi criado",
        ))
        return

    payload = {
        "usuario": test_user["usuario"],
        "senha":   test_user["senha"],
    }

    start = time.time()
    response, error = make_request(
        "POST",
        f"{suite.base_url}/usuarios/login",
        json_body=payload,
    )
    duration = (time.time() - start) * 1000

    if error:
        suite.add(TestResult(
            name="POST /usuarios/login",
            passed=False,
            error=error,
        ))
        return

    passed = response.status_code == 200

    if passed:
        try:
            body = response.json()
            suite.token = body.get("token")
        except Exception:
            pass

    suite.add(TestResult(
        name="POST /usuarios/login",
        passed=passed,
        status=response.status_code,
        duration=duration,
        error=None if passed else f"Status inesperado: {response.status_code}",
    ))


def test_list_categories(suite: SmokeTestSuite):
    if not suite.token:
        suite.add(TestResult(
            name="GET /categorias",
            passed=False,
            error="Skipped — token JWT nao disponivel",
        ))
        return

    start = time.time()
    response, error = make_request(
        "GET",
        f"{suite.base_url}/categorias",
        token=suite.token,
    )
    duration = (time.time() - start) * 1000

    if error:
        suite.add(TestResult(
            name="GET /categorias",
            passed=False,
            error=error,
        ))
        return

    passed = response.status_code == 200
    suite.add(TestResult(
        name="GET /categorias",
        passed=passed,
        status=response.status_code,
        duration=duration,
        error=None if passed else f"Status inesperado: {response.status_code}",
    ))


def test_list_products(suite: SmokeTestSuite):
    if not suite.token:
        suite.add(TestResult(
            name="GET /produtos",
            passed=False,
            error="Skipped — token JWT nao disponivel",
        ))
        return

    start = time.time()
    response, error = make_request(
        "GET",
        f"{suite.base_url}/produtos",
        token=suite.token,
    )
    duration = (time.time() - start) * 1000

    if error:
        suite.add(TestResult(
            name="GET /produtos",
            passed=False,
            error=error,
        ))
        return

    passed = response.status_code == 200
    suite.add(TestResult(
        name="GET /produtos",
        passed=passed,
        status=response.status_code,
        duration=duration,
        error=None if passed else f"Status inesperado: {response.status_code}",
    ))


def test_unauthorized_access(suite: SmokeTestSuite):
    start = time.time()
    response, error = make_request("GET", f"{suite.base_url}/produtos")
    duration = (time.time() - start) * 1000

    if error:
        suite.add(TestResult(
            name="GET /produtos sem token (espera 401)",
            passed=False,
            error=error,
        ))
        return

    passed = response.status_code == 401
    suite.add(TestResult(
        name="GET /produtos sem token (espera 401)",
        passed=passed,
        status=response.status_code,
        duration=duration,
        error=None if passed else (
            f"Esperado 401 mas recebeu {response.status_code} "
            f"— endpoint pode estar desprotegido"
        ),
    ))



def run_suite(suite: SmokeTestSuite):
    tests = [
        test_health,
        test_swagger,
        test_create_user,
        test_login,
        test_list_categories,
        test_list_products,
        test_unauthorized_access,
    ]

    for test_fn in tests:
        test_fn(suite)


def print_report(suite: SmokeTestSuite):
    print("\n" + "=" * 58)
    print(f"  HEALTHY FOOD API — Smoke Tests")
    print(f"  URL: {suite.base_url}")
    print("=" * 58)
    print(f"  {'TESTE':<40} {'STATUS':>8}  {'MS':>6}")
    print("  " + "-" * 54)

    for result in suite.results:
        icon   = "[OK]  " if result.passed else "[FAIL]"
        status = str(result.status) if result.status else "—"
        ms     = f"{result.duration:.0f}" if result.duration else "—"
        print(f"  {icon} {result.name:<38} {status:>6}  {ms:>6}")

        if result.error:
            print(f"         -> {result.error}")

    print("=" * 58)
    print(f"  Passou : {suite.passed}")
    print(f"  Falhou : {suite.failed}")
    print(f"  Total  : {len(suite.results)}")
    print("=" * 58)


def parse_args():
    parser = argparse.ArgumentParser(
        description="Smoke tests pos-deploy da Healthy Food API"
    )
    parser.add_argument(
        "--url",
        default=DEFAULT_URL,
        help=f"URL base da API (padrao: {DEFAULT_URL})",
    )
    parser.add_argument(
        "--skip-wait",
        action="store_true",
        help="Nao aguardar a API ficar disponivel (util se ja estiver rodando)",
    )
    return parser.parse_args()


def main():
    args   = parse_args()
    base_url = args.url.rstrip("/")
    suite  = SmokeTestSuite(base_url=base_url)

    print("=" * 58)
    print("  HEALTHY FOOD API — Smoke Tests")
    print(f"  Ambiente : {base_url}")
    print("=" * 58)

    if not args.skip_wait:
        if not wait_for_api(base_url):
            print("\n[ERRO] API nao respondeu. Abortando testes.")
            sys.exit(1)

    run_suite(suite)
    print_report(suite)

    if suite.all_passed:
        print("\n[OK] Deploy validado. Todos os testes passaram.")
        sys.exit(0)
    else:
        print(f"\n[ERRO] {suite.failed} teste(s) falharam. Verifique os logs.")
        sys.exit(1)


if __name__ == "__main__":
    main()