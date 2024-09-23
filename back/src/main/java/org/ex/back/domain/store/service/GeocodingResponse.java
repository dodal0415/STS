package org.ex.back.domain.store.service;

import lombok.Data;
import java.util.List;

@Data
public class GeocodingResponse {
    private String status;
    private List<Result> results;

    @Data
    public static class Result {
        private Geometry geometry;

        @Data
        public static class Geometry {
            private Location location;

            @Data
            public static class Location {
                private Double lat;
                private Double lng;
            }
        }
    }
}
