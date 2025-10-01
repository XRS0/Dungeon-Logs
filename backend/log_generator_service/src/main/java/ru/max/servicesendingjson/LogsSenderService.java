package ru.max.servicesendingjson;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

@Service
@RequiredArgsConstructor
@Slf4j
public class LogsSenderService {
    @Value("${json.file}")
    private String jsonFile;
    @Value("${logs.per.second}")
    private int logsPerSecond;

    @Value("${log.queue.name}")
    private String logQueueName;

    private int lastLine = 0;

    private final AmqpTemplate amqpTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final SimpMessagingTemplate simpMessagingTemplate;

    @Scheduled(fixedRate = 1000) public void send() {
        try (BufferedReader reader = new BufferedReader(new FileReader(jsonFile))) {
            int currentLine = 0;
            int sent = 0;
            String line;
            while ((line = reader.readLine()) != null && sent < logsPerSecond) {
                if(currentLine++ < lastLine) {
                    continue;
                } try {
                    JsonNode jsonNode = objectMapper.readTree(line);
                    simpMessagingTemplate.convertAndSend("/topic/logs", jsonNode);
                    log.info(jsonNode.toString()); sendToLogsQueue(jsonNode.toString());
                    sent++;
                    lastLine = currentLine;
                }catch (JsonProcessingException e) {
                    throw new RuntimeException("Ошибка в обработке json");
                }
            }
        } catch (IOException e) {
           throw new RuntimeException("Ошибка чтения файла");
        }
    }

    private void sendToLogsQueue(String log){
        amqpTemplate.convertAndSend(logQueueName, log);
    }

}
