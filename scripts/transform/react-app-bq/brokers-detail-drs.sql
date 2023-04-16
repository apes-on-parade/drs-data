SELECT
	SUBSTR(TO_HEX(SHA1(name)),1,8) as id,
	b.name,
	b.country,
	b.drs
FROM `apes-on-parade-default.src_first_party.curated_brokers_snapshot` as b
