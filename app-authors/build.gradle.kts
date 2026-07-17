plugins {
    id("java")
    id("io.quarkus") version "3.37.2"
    id("io.freefair.lombok") version "9.2.0"
}

group = "uce.edu.ec"
version = "unspecified"

repositories {
    mavenCentral()
}

val quarkusVersion = "3.37.2"

java {
    sourceCompatibility = JavaVersion.VERSION_25
    targetCompatibility = JavaVersion.VERSION_25
}

dependencies {
    implementation(enforcedPlatform("io.quarkus.platform:quarkus-bom:$quarkusVersion"))

    // CDI
    implementation("io.quarkus:quarkus-arc")

    // REST
    implementation("io.quarkus:quarkus-rest")
    implementation("io.quarkus:quarkus-rest-jsonb")

    // Persistencia
    implementation("io.quarkus:quarkus-hibernate-orm")
    implementation("io.quarkus:quarkus-hibernate-orm-panache")
    implementation("io.quarkus:quarkus-jdbc-postgresql")

    // Flyway
    implementation("io.quarkus:quarkus-flyway")
    runtimeOnly("org.flywaydb:flyway-database-postgresql")

    // Service Discovery
    implementation("io.smallrye.reactive:smallrye-mutiny-vertx-consul-client")

    // Health Checks
    implementation("io.quarkus:quarkus-smallrye-health")

    // Metricas
    implementation("io.quarkus:quarkus-micrometer-registry-prometheus")

    // Kubernetes
    implementation("io.quarkus:quarkus-kubernetes")
    implementation("io.quarkus:quarkus-container-image-jib")
}

tasks.test {
    useJUnitPlatform()
}