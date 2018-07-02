const userRoles = new Map();
userRoles.set("u1", "user").set("u2", "admin").set("u2","admin1");
console.log(userRoles);
console.log(userRoles.get("u2"));
console.log(userRoles.has("u3"));
console.log(userRoles.size);
userRoles.james = '!2345r';
console.log(userRoles);
console.log(userRoles.keys());
for (let u of userRoles.keys()) {
    console.log(u)
}

for (let u of userRoles.values()) {
    console.log(u)
}

for (let u of userRoles.entries()) {
    console.log(u)
}
for (let [a,...b] of userRoles.entries()) {
    console.log(a, b);
}
console.log([...userRoles.values()]);
