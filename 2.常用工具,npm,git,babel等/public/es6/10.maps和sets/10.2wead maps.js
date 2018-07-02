const SecretHolder = (function () {
    const secrets = new WeakMap();
    return class {
        setSecret(secret) {
            secrets.set(this, secret);
        }

        getSecret() {
            return secrets.get(this);
        }
    }
})();
const a = new SecretHolder();
a.setSecret("aaa");
console.log(a.getSecret());