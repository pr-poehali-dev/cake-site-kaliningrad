UPDATE t_p94533950_cake_site_kaliningra.portfolio_photos 
SET url = 'hidden' 
WHERE char_length(url) > 10000;
