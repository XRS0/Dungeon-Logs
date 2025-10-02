package ru.max.searchingservice.filter;

import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import org.springframework.stereotype.Service;
import ru.max.searchingservice.entity.dto.LogFilter;

import java.util.ArrayList;
import java.util.List;

@Service
public class LogSpecificationBuilder {
    private final List<LogSpecification> filters;

    public LogSpecificationBuilder(List<LogSpecification> filters) {
        this.filters = filters;
    }

    public Query build(LogFilter logFilter) {
        BoolQuery.Builder bool = new BoolQuery.Builder();
        List<Query> filterQueries = new ArrayList<>();

        for (LogSpecification spec : filters) {
            Query q = spec.toQuery(logFilter);
            if (q != null) {
                filterQueries.add(q);
            }
        }

        if(filterQueries.isEmpty()){
            return Query.of(q -> q.matchAll(m -> m));
        }

        bool.filter(filterQueries);
        return Query.of(q -> q.bool(bool.build()));
    }


}
