# Використовуємо базовий образ Alpine Linux
FROM alpine:3.21

ARG version=21.0.6.7.1

# Встановлюємо Amazon Corretto Java 21
RUN wget -O /etc/apk/keys/amazoncorretto.rsa.pub https://apk.corretto.aws/amazoncorretto.rsa.pub && \
    echo "https://apk.corretto.aws" >> /etc/apk/repositories && \
    apk add --no-cache amazon-corretto-21=$version-r0 && \
    rm -rf /usr/lib/jvm/java-21-amazon-corretto/lib/src.zip

# Налаштовуємо змінні середовища
ENV LANG=C.UTF-8
ENV JAVA_HOME=/usr/lib/jvm/default-jvm
ENV PATH=$PATH:/usr/lib/jvm/default-jvm/bin

# Задаємо робочу директорію в контейнері
WORKDIR /app

 # Открываем порт 8080
EXPOSE 8080

# Копіюємо файл jar в контейнер
COPY target/cyber-application.jar cyber-application.jar

# Вказуємо команду для запуску додатка
ENTRYPOINT ["java", "-jar", "cyber-application.jar"]