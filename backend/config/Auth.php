<?php
/**
 * Auth.php — Autenticação JWT simples (sem bibliotecas externas)
 */

class Auth {
    private static string $secret = 'SGN_IPM_MAYOMBE_SECRET_2025_x7k9';
    private static int    $ttl    = 86400 * 7; // 7 dias

    // ─── Gerar token ────────────────────────────────────────

    public static function generateToken(array $payload): string {
        $header  = self::b64url(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
        $payload['iat'] = time();
        $payload['exp'] = time() + self::$ttl;
        $body    = self::b64url(json_encode($payload));
        $sig     = self::b64url(hash_hmac('sha256', "$header.$body", self::$secret, true));
        return "$header.$body.$sig";
    }

    // ─── Validar token ──────────────────────────────────────

    public static function validateToken(string $token): ?array {
        $parts = explode('.', $token);
        if (count($parts) !== 3) return null;

        [$header, $body, $sig] = $parts;
        $expectedSig = self::b64url(hash_hmac('sha256', "$header.$body", self::$secret, true));

        if (!hash_equals($expectedSig, $sig)) return null;

        $payload = json_decode(self::b64url_decode($body), true);
        if (!$payload) return null;

        if (isset($payload['exp']) && $payload['exp'] < time()) return null;

        return $payload;
    }

    // ─── Extrair token do header Authorization ───────────────
    // Tenta múltiplas fontes porque o XAMPP/Apache no Windows
    // às vezes não passa o header Authorization ao PHP

    public static function getTokenFromRequest(): ?string {
        // 1. Forma padrão
        $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

        // 2. Fallback — Apache mod_rewrite via .htaccess
        if (empty($auth)) {
            $auth = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
        }

        // 3. Fallback — getallheaders() (funciona nalgumas configs do Apache)
        if (empty($auth) && function_exists('getallheaders')) {
            $headers = getallheaders();
            // getallheaders pode devolver chaves com capitalização variável
            foreach ($headers as $name => $value) {
                if (strtolower($name) === 'authorization') {
                    $auth = $value;
                    break;
                }
            }
        }

        if (preg_match('/^Bearer\s+(.+)$/i', $auth, $m)) {
            return $m[1];
        }

        return null;
    }

    // ─── Middleware: exige login (qualquer perfil) ───────────

    public static function requireLogin(): array {
        $token   = self::getTokenFromRequest();
        $payload = $token ? self::validateToken($token) : null;

        if (!$payload) {
            http_response_code(401);
            echo json_encode(['error' => 'Autenticação necessária. Faça login primeiro.']);
            exit();
        }

        return $payload;
    }

    // ─── Middleware: exige perfil específico ─────────────────

    public static function requireRole(string ...$roles): array {
        $payload = self::requireLogin();

        if (!in_array($payload['type'] ?? '', $roles)) {
            http_response_code(403);
            echo json_encode([
                'error' => 'Acesso negado. Perfil necessário: ' . implode(' ou ', $roles)
            ]);
            exit();
        }

        return $payload;
    }

    // ─── Helpers Base64URL ───────────────────────────────────

    private static function b64url(string $data): string {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function b64url_decode(string $data): string {
        return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', 3 - (3 + strlen($data)) % 4));
    }
}
?>