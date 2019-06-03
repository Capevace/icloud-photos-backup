const cliProgress = require('cli-progress');

let progress = {
	start: () => {},
	stop: () => {},
	update: () => {},
	setTotal: () => {},
	increment: () => {}
};

/**
 * Set wether to show or not to show the progress bar.
 *
 * This either sets the progress bar object to either the real one from cli-progress
 * or a mocked noop version.
 * 
 * @param {Bool} showProgress Wether to show a progress bar or not.
 */
module.exports.setShowProgress = function setShowProgress(showProgress) {
	progress = showProgress
		? new cliProgress.Bar(
				{
					barsize: 12,
					clearOnComplete: true,
					format:
						'[{bar}] {percentage}% | {action} | {album} | {value}/{total} | ETA: {eta_formatted}'
				},
				cliProgress.Presets.legacy
		  )
		: {
				start: () => {},
				stop: () => {},
				update: () => {},
				setTotal: () => {},
				increment: () => {}
		  };
};

/**
 * Get the progress object for the program. 
 * 
 * If the progress flag is disabled,
 * it returns a mock object that doesn't actually do anything.
 * 
 * @return {cliProgress~Bar|Object} The progress bar object.
 */
module.exports.progress = () => progress;

/**
 * Convert a Apple Core Data timestamp to a JavaScript Date object.
 *
 * Apple's Core Data assumes Epoch to be thirtyone years before the normal UNIX Epoch.
 * This function simply adds 978307200000 (thirtyone years) to the date to convert it.
 *
 * @param  {Number} coreDataDate The Core Data timestamp.
 * @return {Date}                The date object.
 */
module.exports.coreDataDateToJSDate = function coreDataDateToJSDate(
	coreDataDate
) {
	// 978307200000 is thirtyone years, no clue why apple does it that way
	return new Date(parseInt(coreDataDate) * 1000 + 978307200000);
};
