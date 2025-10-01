package ru.max.servicesendingjson;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.logging.Logger;

@Service
public class LogsSenderService {
    Logger log = Logger.getLogger(LogsSenderService.class.getName());

    private final AmqpTemplate amqpTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final SimpMessagingTemplate simpMessagingTemplate;

    public LogsSenderService(AmqpTemplate amqpTemplate, SimpMessagingTemplate simpMessagingTemplate) {
        this.amqpTemplate = amqpTemplate;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @Value("${logs.per.second}")
    private int logsPerSecond;

    @Value("${log.queue.name}")
    private String logQueueName;

    @Value("${logs.path}")
    private String logsPath;

    private int lastLine = 0;

    @Scheduled(fixedRate = 1000)
    public void send() {
        Path directory = Paths.get(logsPath);
        log.info("Обход папки {}" + logsPath);

        if (!Files.exists(directory)) {
            log.info("Папка {} не найдена" + logsPath);
            return;
        }

        try (DirectoryStream<Path> stream = Files.newDirectoryStream(directory, "*.json")) {
            for (Path entry : stream) {
                try (BufferedReader reader = new BufferedReader(new FileReader(entry.toFile()))) {
                    int currentLine = 0;
                    int sent = 0;
                    String line;

                    while ((line = reader.readLine()) != null && sent < logsPerSecond) {
                        if (currentLine++ < lastLine) continue;

                        try {
                            JsonNode jsonNode = objectMapper.readTree(line);
                            simpMessagingTemplate.convertAndSend("/topic/logs", jsonNode);
                            log.info("Отправлен: {}" + jsonNode);
                            sendToLogsQueue(jsonNode.toString());
                            sent++;
                            lastLine = currentLine;
                        } catch (JsonProcessingException e) {
                            throw new RuntimeException("Ошибка обработки json " + e);
                        }
                    }
                } catch (IOException e) {
                    throw new RuntimeException("Ошибка чтения файла" + e);
                }
            }
        } catch (IOException e) {
            throw new RuntimeException("Ошибка чтения папки" + e);
        }
    }

    private void sendToLogsQueue(String log){
        amqpTemplate.convertAndSend(logQueueName, log);
    }

}
