export const GoodOverBadquery = `
WITH AvgCampaignMetrics AS (
    SELECT
        AVG(c."Impressions") AS "AvgImpressions",
        AVG(c."Clicks") AS "AvgClicks",
        AVG(c."NewSubscriptions") AS "AvgNewSubscriptions",
        AVG(c."Revenue") AS "AvgRevenue",
        AVG(c."Subscription Cost") AS "AvgSubscriptionCost",
        AVG(c."Revenue") - AVG(c."Budget") AS "AvgROI"
    FROM
        Campaign c
),

CampaignMetrics AS (
    SELECT
        c."CampaignID",
        c."Impressions",
        c."Clicks",
        c."NewSubscriptions",
        c."Revenue",
        c."Subscription Cost",
        (c."Revenue" - c."Budget") AS "ROI",
        acm."AvgImpressions",
        acm."AvgClicks",
        acm."AvgNewSubscriptions",
        acm."AvgRevenue",
        acm."AvgSubscriptionCost",
        acm."AvgROI"
    FROM
        Campaign c
    CROSS JOIN
        AvgCampaignMetrics acm
),

CategorizedCampaigns AS (
    SELECT
        cm."CampaignID",
        cm."Impressions",
        cm."Clicks",
        cm."NewSubscriptions",
        cm."Revenue",
        cm."Subscription Cost",
        cm."ROI",
        CASE
            WHEN cm."Impressions" > cm."AvgImpressions" 
                 AND cm."Clicks" > cm."AvgClicks" 
                 AND cm."NewSubscriptions" > cm."AvgNewSubscriptions" 
                 AND cm."Revenue" > cm."AvgRevenue"
            THEN 'Good Campaign'
            ELSE 'Bad Campaign'
        END AS "CampaignType"
    FROM
        CampaignMetrics cm
)

SELECT
    cc."CampaignType",
    COUNT(*) AS "CampaignCount"
FROM
    CategorizedCampaigns cc
GROUP BY
    cc."CampaignType";

`;
